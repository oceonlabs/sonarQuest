// SonarQube API service for connecting to your Oracle Cloud instance
export interface SonarQubeConfig {
  baseUrl: string
  token: string
  organization?: string
}

export class SonarQubeService {
  private baseUrl: string
  private token: string
  private organization?: string

  constructor(config: SonarQubeConfig) {
    this.baseUrl = config.baseUrl.endsWith('/') 
      ? config.baseUrl.slice(0, -1) 
      : config.baseUrl
    this.token = config.token
    this.organization = config.organization
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${this.baseUrl}/api/${endpoint}`)
    
    // Add organization if specified
    if (this.organization) {
      params.organization = this.organization
    }
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`SonarQube API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Fetch all projects
  async getProjects() {
    const response = await this.makeRequest('projects/search', {
      ps: '100', // page size
    })

    return response.components.map((project: any) => ({
      id: project.key,
      name: project.name,
      key: project.key,
      description: project.description || '',
      qualityGateStatus: 'OK', // Will be updated by getProjectQualityGate
      metrics: {},
      lastAnalysisDate: project.lastAnalysisDate || new Date().toISOString(),
    }))
  }

  // Get project metrics
  async getProjectMetrics(projectKey: string) {
    const metrics = [
      'reliability_rating',
      'security_rating', 
      'sqale_rating',
      'coverage',
      'duplicated_lines_density',
      'ncloc',
      'bugs',
      'vulnerabilities',
      'code_smells',
      'sqale_index', // technical debt
    ]

    const response = await this.makeRequest('measures/component', {
      component: projectKey,
      metricKeys: metrics.join(','),
    })

    const metricsMap: any = {}
    response.component.measures?.forEach((measure: any) => {
      metricsMap[measure.metric] = parseFloat(measure.value) || 0
    })

    return {
      reliability_rating: metricsMap.reliability_rating || 1,
      security_rating: metricsMap.security_rating || 1,
      sqale_rating: metricsMap.sqale_rating || 1,
      coverage: metricsMap.coverage || 0,
      duplicated_lines_density: metricsMap.duplicated_lines_density || 0,
      ncloc: metricsMap.ncloc || 0,
      bugs: metricsMap.bugs || 0,
      vulnerabilities: metricsMap.vulnerabilities || 0,
      code_smells: metricsMap.code_smells || 0,
      technical_debt: metricsMap.sqale_index || 0,
    }
  }

  // Get quality gate status
  async getProjectQualityGate(projectKey: string) {
    try {
      const response = await this.makeRequest('qualitygates/project_status', {
        projectKey,
      })
      
      return response.projectStatus?.status || 'OK'
    } catch (error) {
      console.warn(`Could not fetch quality gate for ${projectKey}:`, error)
      return 'OK'
    }
  }

  // Get project activity/history
  async getProjectActivity(projectKey: string, limit: number = 10) {
    try {
      const response = await this.makeRequest('project_analyses/search', {
        project: projectKey,
        ps: limit.toString(),
      })
      
      return response.analyses || []
    } catch (error) {
      console.warn(`Could not fetch activity for ${projectKey}:`, error)
      return []
    }
  }

  // Get issues for gamification scoring
  async getProjectIssues(projectKey: string) {
    try {
      const response = await this.makeRequest('issues/search', {
        componentKeys: projectKey,
        ps: '500',
        facets: 'severities,types,authors',
      })
      
      return {
        issues: response.issues || [],
        facets: response.facets || [],
      }
    } catch (error) {
      console.warn(`Could not fetch issues for ${projectKey}:`, error)
      return { issues: [], facets: [] }
    }
  }

  // Test connection
  async testConnection() {
    try {
      await this.makeRequest('system/status')
      return true
    } catch (error) {
      console.error('SonarQube connection test failed:', error)
      return false
    }
  }
}

// Factory function to create service instance
export function createSonarQubeService(config: SonarQubeConfig) {
  return new SonarQubeService(config)
}
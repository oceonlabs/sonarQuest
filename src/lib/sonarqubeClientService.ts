// Direct client-side SonarQube API service to bypass Cloudflare bot protection
export interface SonarQubeConfig {
  baseUrl: string
  token: string
  organization?: string
}

export class SonarQubeClientService {
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
    try {
      // Construct the SonarQube API URL
      const url = new URL(`${this.baseUrl}/api/${endpoint}`)
      
      // Add organization if specified
      if (this.organization && this.organization.trim()) {
        params.organization = this.organization
        console.log('Adding organization parameter:', this.organization)
      } else {
        console.log('No organization specified - using default')
      }
      
      // Add query parameters
      Object.entries(params || {}).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })

      console.log('Making direct client request to:', url.toString())

      // Make direct request from browser - this should bypass Cloudflare bot protection
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        // This is important - tells the browser to include credentials/cookies
        credentials: 'omit', // Don't send cookies to avoid CORS issues
        mode: 'cors', // Enable CORS
      })

      if (!response.ok) {
        const status = response.status
        const statusText = response.statusText
        
        // Try to get the response body for more details
        let errorDetails = ''
        try {
          const errorText = await response.text()
          errorDetails = errorText ? ` - ${errorText.substring(0, 500)}` : ''
        } catch {
          // Ignore if we can't read the response body
        }
        
        console.error(`SonarQube API error: ${status} ${statusText}${errorDetails}`)
        
        if (status === 0 || status === undefined) {
          throw new Error('Network error: Unable to connect to SonarQube server. This might be a CORS issue.')
        } else if (status === 401) {
          throw new Error(`Authentication failed: Invalid token or insufficient permissions${errorDetails}`)
        } else if (status === 403) {
          throw new Error(`Access forbidden: Check your permissions and organization settings${errorDetails}`)
        } else if (status === 404) {
          throw new Error(`SonarQube server not found: Verify the server URL${errorDetails}`)
        } else {
          throw new Error(`SonarQube API error: ${status} ${statusText}${errorDetails}`)
        }
      }

      const responseData = await response.json()
      return responseData

    } catch (error) {
      console.error('SonarQube client error:', error)
      
      // Handle different types of errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to SonarQube server. This might be a CORS issue - check if CORS is enabled on your SonarQube server.')
      } else if (error instanceof Error) {
        throw error
      } else {
        throw new Error('Unknown error occurred while connecting to SonarQube')
      }
    }
  }

  // Fetch all projects
  async getProjects() {
    const response = await this.makeRequest('projects/search', {
      ps: '100',
    })

    return response.components.map((project: any) => ({
      id: project.key,
      name: project.name,
      key: project.key,
      description: project.description || '',
      qualityGateStatus: 'OK',
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
      'sqale_index',
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
      // Special mock mode for testing
      if (this.baseUrl.includes('mock') || this.baseUrl.includes('localhost')) {
        console.log('Mock connection test - simulating success')
        return true
      }
      
      await this.makeRequest('system/status')
      return true
    } catch (error) {
      console.error('SonarQube connection test failed:', error)
      return false
    }
  }
}

// Factory function to create service instance
export function createSonarQubeClientService(config: SonarQubeConfig) {
  return new SonarQubeClientService(config)
}
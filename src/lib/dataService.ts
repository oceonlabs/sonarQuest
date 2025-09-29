import { createSonarQubeService } from './sonarqubeService'
import { createSonarQubeClientService } from './sonarqubeClientService'
import { mockProjects, mockDevelopers, mockTeams, mockAchievements } from './mockData'
import type { Project, Developer, Team, Achievement } from './mockData'
import { configService } from './configService'

// Create SonarQube service instance dynamically based on configuration
let sonarQubeService: ReturnType<typeof createSonarQubeService> | null = null
let sonarQubeClientService: ReturnType<typeof createSonarQubeClientService> | null = null

function updateSonarQubeService() {
  const config = configService.getConfig()
  if (config.isConnected && config.baseUrl && config.token) {
    // Use client-side service to bypass Cloudflare bot protection
    sonarQubeClientService = createSonarQubeClientService({
      baseUrl: config.baseUrl,
      token: config.token,
      organization: config.organization
    })
    
    // Keep the old service for backward compatibility if needed
    sonarQubeService = createSonarQubeService({
      baseUrl: config.baseUrl,
      token: config.token,
      organization: config.organization
    })
  } else {
    sonarQubeService = null
    sonarQubeClientService = null
  }
}

// Initialize service
updateSonarQubeService()

// Subscribe to configuration changes
configService.subscribe(() => {
  updateSonarQubeService()
})

export class DataService {
  private static instance: DataService
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }
    return DataService.instance
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T
    }
    return null
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  async getProjects(): Promise<Project[]> {
    const cacheKey = 'projects'
    const cached = this.getCachedData<Project[]>(cacheKey)
    if (cached) return cached

    // Try client-side service first to avoid Cloudflare bot protection
    if (sonarQubeClientService) {
      try {
        console.log('Using client-side SonarQube service...')
        
        // Test connection first
        const isConnected = await sonarQubeClientService.testConnection()
        if (!isConnected) {
          console.warn('SonarQube client connection failed, falling back to mock data')
          return mockProjects
        }

        console.log('Fetching projects from SonarQube via client service...')
        const projects = await sonarQubeClientService.getProjects()
        
        // Enrich projects with metrics and quality gate status
        const enrichedProjects = await Promise.all(
          projects.map(async (project: any) => {
            try {
              const [metrics, qualityGate] = await Promise.all([
                sonarQubeClientService!.getProjectMetrics(project.key),
                sonarQubeClientService!.getProjectQualityGate(project.key),
              ])
              
              return {
                ...project,
                metrics,
                qualityGateStatus: qualityGate,
              }
            } catch (error) {
              console.warn(`Failed to enrich project ${project.key}:`, error)
              return {
                ...project,
                metrics: {},
                qualityGateStatus: 'OK',
              }
            }
          })
        )

        this.setCachedData(cacheKey, enrichedProjects)
        return enrichedProjects
        
      } catch (error) {
        console.warn('SonarQube client service failed, trying server proxy...', error)
        // Fall through to server proxy attempt
      }
    }

    // Fallback to server proxy if client service fails
    if (!sonarQubeService) {
      console.log('Using mock data - SonarQube not configured')
      return mockProjects
    }

    try {
      // Test connection first
      const isConnected = await sonarQubeService.testConnection()
      if (!isConnected) {
        console.warn('SonarQube connection failed, falling back to mock data')
        return mockProjects
      }

      console.log('Fetching projects from SonarQube via server proxy...')
      const projects = await sonarQubeService.getProjects()
      
      // Enrich projects with metrics and quality gate status
      const enrichedProjects = await Promise.all(
        projects.map(async (project: any) => {
          try {
            const [metrics, qualityGate] = await Promise.all([
              sonarQubeService!.getProjectMetrics(project.key),
              sonarQubeService!.getProjectQualityGate(project.key),
            ])
            
            return {
              ...project,
              metrics,
              qualityGateStatus: qualityGate,
            }
          } catch (error) {
            console.warn(`Failed to fetch data for project ${project.key}:`, error)
            return project
          }
        })
      )

      this.setCachedData(cacheKey, enrichedProjects)
      return enrichedProjects
    } catch (error) {
      console.error('Failed to fetch projects from SonarQube:', error)
      return mockProjects
    }
  }

  async getProjectDetails(projectKey: string): Promise<Project | null> {
    const projects = await this.getProjects()
    return projects.find(p => p.key === projectKey) || null
  }

  async getProjectActivity(projectKey: string) {
    if (!sonarQubeService) {
      return []
    }

    try {
      return await sonarQubeService.getProjectActivity(projectKey)
    } catch (error) {
      console.error(`Failed to fetch activity for project ${projectKey}:`, error)
      return []
    }
  }

  async getProjectIssues(projectKey: string) {
    if (!sonarQubeService) {
      return { issues: [], facets: [] }
    }

    try {
      return await sonarQubeService.getProjectIssues(projectKey)
    } catch (error) {
      console.error(`Failed to fetch issues for project ${projectKey}:`, error)
      return { issues: [], facets: [] }
    }
  }

  // For now, developers, teams, and achievements remain mock data
  // These would need additional SonarQube plugins or custom logic to generate
  async getDevelopers(): Promise<Developer[]> {
    return mockDevelopers
  }

  async getTeams(): Promise<Team[]> {
    return mockTeams
  }

  async getAchievements(): Promise<Achievement[]> {
    return mockAchievements
  }

  // Utility method to check if real SonarQube is being used
  isUsingRealData(): boolean {
    return !!sonarQubeService
  }

  // Method to get connection status
  async getConnectionStatus() {
    const config = configService.getConfig()
    
    if (!sonarQubeService || !config.isConnected) {
      return {
        connected: false,
        mode: 'mock',
        message: 'Using mock data - SonarQube not configured'
      }
    }

    try {
      const isConnected = await sonarQubeService.testConnection()
      return {
        connected: isConnected,
        mode: 'real',
        message: isConnected 
          ? `Connected to ${config.baseUrl}` 
          : 'Connection to SonarQube failed'
      }
    } catch (error) {
      return {
        connected: false,
        mode: 'real',
        message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Method to test connection with provided credentials
  async testConnection(baseUrl: string, token: string, organization?: string) {
    try {
      // Try client service first to avoid Cloudflare bot protection
      const testClientService = createSonarQubeClientService({
        baseUrl: baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl,
        token,
        organization
      })
      
      console.log('Testing connection with client service...')
      const isConnected = await testClientService.testConnection()
      
      if (isConnected) {
        return {
          success: true,
          message: 'Connection successful (via client service)'
        }
      }
      
      // Fallback to server proxy if client fails
      console.log('Client service failed, trying server proxy...')
      const testService = createSonarQubeService({
        baseUrl: baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl,
        token,
        organization
      })
      
      const serverConnected = await testService.testConnection()
      return {
        success: serverConnected,
        message: serverConnected ? 'Connection successful (via server proxy)' : 'Connection failed on both client and server'
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
}

// Export singleton instance
export const dataService = DataService.getInstance()
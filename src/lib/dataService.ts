import { createSonarQubeService } from './sonarqubeService'
import { mockProjects, mockDevelopers, mockTeams, mockAchievements } from './mockData'
import type { Project, Developer, Team, Achievement } from './mockData'

// Configuration from environment variables
const SONARQUBE_CONFIG = {
  baseUrl: import.meta.env.VITE_SONARQUBE_URL || '',
  token: import.meta.env.VITE_SONARQUBE_TOKEN || '',
  organization: import.meta.env.VITE_SONARQUBE_ORGANIZATION,
}

const USE_REAL_SONARQUBE = import.meta.env.VITE_USE_REAL_SONARQUBE === 'true'

// Create SonarQube service instance
let sonarQubeService: ReturnType<typeof createSonarQubeService> | null = null

if (USE_REAL_SONARQUBE && SONARQUBE_CONFIG.baseUrl && SONARQUBE_CONFIG.token) {
  sonarQubeService = createSonarQubeService(SONARQUBE_CONFIG)
}

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

      console.log('Fetching projects from SonarQube...')
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
    if (!sonarQubeService) {
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
          ? `Connected to ${SONARQUBE_CONFIG.baseUrl}` 
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
}

// Export singleton instance
export const dataService = DataService.getInstance()
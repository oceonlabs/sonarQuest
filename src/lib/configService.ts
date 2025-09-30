// Configuration service for managing SonarQube connection settings
export interface SonarQubeConnectionConfig {
  baseUrl: string
  token: string
  organization?: string
  isConnected: boolean
  isConfiguredViaEnv: boolean
  proxy?: {
    enabled: boolean
    type: 'http' | 'socks5' | 'cloudflare-tunnel'
    host?: string
    port?: number
    tunnelUrl?: string
  }
}

const SONARQUBE_CONFIG_KEY = 'sonarquest-config'

// Check if configuration is provided via environment variables
const hasEnvConfig = (): boolean => {
  return !!(import.meta.env.VITE_SONARQUBE_URL && import.meta.env.VITE_SONARQUBE_TOKEN)
}

// Default configuration from environment variables
const getDefaultConfig = (): SonarQubeConnectionConfig => ({
  baseUrl: import.meta.env.VITE_SONARQUBE_URL || '',
  token: import.meta.env.VITE_SONARQUBE_TOKEN || '',
  organization: import.meta.env.VITE_SONARQUBE_ORGANIZATION || '',
  isConnected: !!(import.meta.env.VITE_USE_REAL_SONARQUBE === 'true' && 
                  import.meta.env.VITE_SONARQUBE_URL && 
                  import.meta.env.VITE_SONARQUBE_TOKEN),
  isConfiguredViaEnv: hasEnvConfig(),
  proxy: {
    enabled: import.meta.env.VITE_PROXY_ENABLED === 'true',
    type: (import.meta.env.VITE_PROXY_TYPE as 'http' | 'socks5' | 'cloudflare-tunnel') || 'http',
    host: import.meta.env.VITE_PROXY_HOST || '',
    port: import.meta.env.VITE_PROXY_PORT ? parseInt(import.meta.env.VITE_PROXY_PORT) : undefined,
    tunnelUrl: import.meta.env.VITE_PROXY_TUNNEL_URL || ''
  }
})

class ConfigurationService {
  private static instance: ConfigurationService
  private config: SonarQubeConnectionConfig
  private listeners: Set<(config: SonarQubeConnectionConfig) => void> = new Set()

  private constructor() {
    // Load configuration from localStorage or use defaults
    this.config = this.loadConfig()
  }

  static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService()
    }
    return ConfigurationService.instance
  }

  private loadConfig(): SonarQubeConnectionConfig {
    const defaultConfig = getDefaultConfig()
    
    // If configuration is provided via environment variables, use it exclusively
    // and ignore localStorage
    if (defaultConfig.isConfiguredViaEnv) {
      console.log('SonarQube configuration loaded from environment variables')
      return defaultConfig
    }
    
    // Otherwise, try to load from localStorage
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(SONARQUBE_CONFIG_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          return { ...defaultConfig, ...parsed, isConfiguredViaEnv: false }
        }
      }
    } catch (error) {
      console.warn('Failed to load SonarQube config from localStorage:', error)
    }
    return defaultConfig
  }

  private saveConfig(): void {
    // Don't save to localStorage if configuration is from environment variables
    if (this.config.isConfiguredViaEnv) {
      console.log('Configuration is managed via environment variables, skipping localStorage save')
      return
    }
    
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(SONARQUBE_CONFIG_KEY, JSON.stringify(this.config))
      }
    } catch (error) {
      console.error('Failed to save SonarQube config to localStorage:', error)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.config))
  }

  getConfig(): SonarQubeConnectionConfig {
    return { ...this.config }
  }

  // Get config without sensitive token data (for UI display)
  getConfigSafe(): Omit<SonarQubeConnectionConfig, 'token'> & { hasToken: boolean } {
    const { token, ...safeConfig } = this.config
    return {
      ...safeConfig,
      hasToken: !!token
    }
  }

  updateConfig(newConfig: Partial<SonarQubeConnectionConfig>): void {
    // Don't allow updates if configuration is from environment variables
    if (this.config.isConfiguredViaEnv) {
      console.warn('Cannot update configuration: it is managed via environment variables')
      return
    }
    
    this.config = { ...this.config, ...newConfig }
    this.saveConfig()
    this.notifyListeners()
  }

  connectToSonarQube(baseUrl: string, token: string, organization?: string): void {
    // Don't allow manual connection if configuration is from environment variables
    if (this.config.isConfiguredViaEnv) {
      console.warn('Cannot manually connect: configuration is managed via environment variables')
      return
    }
    
    this.updateConfig({
      baseUrl: baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl,
      token,
      organization,
      isConnected: true
    })
  }

  disconnectFromSonarQube(): void {
    // Don't allow disconnection if configuration is from environment variables
    if (this.config.isConfiguredViaEnv) {
      console.warn('Cannot disconnect: configuration is managed via environment variables')
      return
    }
    
    this.updateConfig({
      isConnected: false
    })
  }

  isUsingRealData(): boolean {
    return this.config.isConnected && !!this.config.baseUrl && !!this.config.token
  }

  // Subscribe to configuration changes
  subscribe(listener: (config: SonarQubeConnectionConfig) => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
}

export const configService = ConfigurationService.getInstance()
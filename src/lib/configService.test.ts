import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configService } from './configService'

// Mock localStorage for testing
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

vi.stubGlobal('localStorage', mockLocalStorage)

// Mock environment variables
vi.mock('import.meta', () => ({
  env: {
    VITE_SONARQUBE_URL: '',
    VITE_SONARQUBE_TOKEN: '',
    VITE_SONARQUBE_ORGANIZATION: '',
    VITE_USE_REAL_SONARQUBE: 'false'
  }
}))

describe('ConfigService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('should return default config when no localStorage data exists', () => {
    const config = configService.getConfig()
    
    expect(config).toEqual({
      baseUrl: '',
      token: '',
      organization: '',
      isConnected: false
    })
  })

  it('should update config correctly', () => {
    const newConfig = {
      baseUrl: 'https://sonarqube.example.com',
      token: 'test-token'
    }
    
    configService.updateConfig(newConfig)
    const config = configService.getConfig()
    
    expect(config.baseUrl).toBe('https://sonarqube.example.com')
    expect(config.token).toBe('test-token')
  })

  it('should identify when not using real data', () => {
    expect(configService.isUsingRealData()).toBe(false)
  })

  it('should connect to SonarQube', () => {
    configService.connectToSonarQube('https://sonarqube.test.com', 'token123', 'org')
    const config = configService.getConfig()
    
    expect(config.baseUrl).toBe('https://sonarqube.test.com')
    expect(config.token).toBe('token123')
    expect(config.organization).toBe('org')
    expect(config.isConnected).toBe(true)
  })

  it('should disconnect from SonarQube', () => {
    // First connect
    configService.connectToSonarQube('https://test.com', 'token')
    expect(configService.getConfig().isConnected).toBe(true)
    
    // Then disconnect
    configService.disconnectFromSonarQube()
    expect(configService.getConfig().isConnected).toBe(false)
  })
})
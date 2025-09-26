import { createServerFn } from '@tanstack/react-start'

interface SonarQubeRequest {
  baseUrl: string
  token: string
  organization?: string
  endpoint: string
  params?: Record<string, string>
}

export const sonarQubeProxy = createServerFn(
  'POST',
  async (data: SonarQubeRequest) => {
    const { baseUrl, token, organization, endpoint, params = {} } = data

    if (!baseUrl || !token || !endpoint) {
      throw new Error('Missing required parameters: baseUrl, token, endpoint')
    }

    try {
      // Construct the SonarQube API URL
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
      const url = new URL(`${cleanBaseUrl}/api/${endpoint}`)
      
      // Add organization if specified
      if (organization) {
        params.organization = organization
      }
      
      // Add query parameters
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })

      // Make the request to SonarQube
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'SonarQuest-Proxy/1.0',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        // Provide more detailed error information
        const status = response.status
        const statusText = response.statusText
        
        if (status === 401) {
          throw new Error(`Authentication failed: Invalid token or insufficient permissions`)
        } else if (status === 403) {
          throw new Error(`Access forbidden: Check your permissions and organization settings`)
        } else if (status === 404) {
          throw new Error(`SonarQube server not found: Verify the server URL`)
        } else {
          throw new Error(`SonarQube API error: ${status} ${statusText}`)
        }
      }

      const responseData = await response.json()
      return responseData

    } catch (error) {
      console.error('SonarQube proxy error:', error)
      
      // Handle different types of errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to SonarQube server. Check the URL and network connectivity.')
      } else if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout: SonarQube server took too long to respond')
      } else if (error instanceof Error) {
        throw error // Re-throw our custom errors
      } else {
        throw new Error('Unknown error occurred while connecting to SonarQube')
      }
    }
  }
)
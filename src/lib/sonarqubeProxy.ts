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
      })

      if (!response.ok) {
        throw new Error(`SonarQube API error: ${response.status} ${response.statusText}`)
      }

      const responseData = await response.json()
      return responseData

    } catch (error) {
      console.error('SonarQube proxy error:', error)
      throw new Error(
        `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
)
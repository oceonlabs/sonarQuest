import { createServerFn } from '@tanstack/react-start'

interface SonarQubeRequest {
  baseUrl: string
  token: string
  organization?: string
  endpoint: string
  params?: Record<string, string>
}

export const sonarQubeProxy = createServerFn({
  method: 'POST',
}).handler(async (ctx: any) => {
    console.log('Server function received ctx:', ctx)
    console.log('Context keys:', Object.keys(ctx || {}))
    
    // In TanStack Start, the data might be passed in different ways
    let data: SonarQubeRequest | undefined
    
    if (ctx && typeof ctx === 'object') {
      // Method 1: Check if ctx itself is our data
      if ('baseUrl' in ctx && 'token' in ctx && 'endpoint' in ctx) {
        data = ctx as SonarQubeRequest
        console.log('Found data directly in ctx:', data)
      }
      // Method 2: Check if there's a data property
      else if (ctx.data && typeof ctx.data === 'object') {
        data = ctx.data as SonarQubeRequest
        console.log('Found data in ctx.data:', data)
      }
      // Method 3: Check context object
      else if (ctx.context && typeof ctx.context === 'object') {
        // Check if context has our data
        if (ctx.context.data) {
          data = ctx.context.data as SonarQubeRequest
          console.log('Found data in ctx.context.data:', data)
        } else if ('baseUrl' in ctx.context) {
          data = ctx.context as SonarQubeRequest
          console.log('Found data in ctx.context:', data)
        }
      }
      // Method 4: Check sendContext 
      else if (ctx.sendContext && typeof ctx.sendContext === 'object') {
        if ('baseUrl' in ctx.sendContext) {
          data = ctx.sendContext as SonarQubeRequest
          console.log('Found data in ctx.sendContext:', data)
        }
      }
    }
    
    if (!data || !data.baseUrl) {
      console.log('All attempts failed. Full context:', JSON.stringify(ctx, null, 2))
      throw new Error(`No valid data received. Context keys: ${Object.keys(ctx || {}).join(', ')}`)
    }
    
    return await makeSonarQubeRequest(data)
})

async function makeSonarQubeRequest({ baseUrl, token, organization, endpoint, params = {} }: SonarQubeRequest) {
    console.log('Making SonarQube request with:', { 
      baseUrl, 
      token: `${token.substring(0, 10)}...`, 
      organization: organization || '(empty)', 
      endpoint, 
      params 
    })

    if (!baseUrl || !token || !endpoint) {
      throw new Error('Missing required parameters: baseUrl, token, endpoint')
    }

    try {
      // Construct the SonarQube API URL
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
      const url = new URL(`${cleanBaseUrl}/api/${endpoint}`)
      
      // Add organization if specified
      if (organization && organization.trim()) {
        params.organization = organization
        console.log('Adding organization parameter:', organization)
      } else {
        console.log('No organization specified - using default')
      }
      
      // Add query parameters
      Object.entries(params || {}).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })

      console.log('Final request URL:', url.toString())
      console.log('Request headers will include:', {
        'Authorization': `Bearer ${token.substring(0, 10)}...`,
        'Content-Type': 'application/json',
        'User-Agent': 'SonarQuest-Proxy/1.0'
      })

      // Make the request to SonarQube
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        // Provide more detailed error information
        const status = response.status
        const statusText = response.statusText
        
        // Try to get the response body for more details
        let errorDetails = ''
        try {
          const errorText = await response.text()
          errorDetails = errorText ? ` - ${errorText}` : ''
        } catch {
          // Ignore if we can't read the response body
        }
        
        console.error(`SonarQube API error: ${status} ${statusText}${errorDetails}`)
        console.error('Request was to:', url.toString())
        
        if (status === 401) {
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
      console.error('SonarQube proxy error:', error)
      
      // Handle different types of errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to SonarQube server. Check the URL and network connectivity.')
      } else if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout: SonarQube server took too long to respond')
      } else if (error instanceof Error) {
        throw error
      } else {
        throw new Error('Unknown error occurred while connecting to SonarQube')
      }
    }
}
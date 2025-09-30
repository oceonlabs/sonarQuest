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

    // Retry logic specifically for Cloudflare challenges
    let lastError: Error | undefined
    const maxRetries = 5
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} - Making request to SonarQube`)
        
        // Add progressive delays for Cloudflare
        if (attempt > 1) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000) + Math.random() * 1000
          console.log(`Adding ${Math.round(delay)}ms delay before retry`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }

        // Enhanced headers for Cloudflare bypass
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'User-Agent': getRotatingUserAgent(attempt),
          'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"macOS"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }

        try {
          const urlObj = new URL(baseUrl)
          headers['Referer'] = urlObj.origin
          headers['Origin'] = urlObj.origin
        } catch {
          // Invalid URL, skip origin headers
        }

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers,
          signal: AbortSignal.timeout(15000)
        })

        // Check if we got a Cloudflare challenge page
        const responseText = await response.text()
        
        if (responseText.includes('Just a moment...') || 
            responseText.includes('challenge-platform') ||
            responseText.includes('cf-browser-verification') ||
            responseText.includes('DDoS protection by Cloudflare')) {
          
          console.log(`Attempt ${attempt}: Received Cloudflare challenge page`)
          
          if (attempt === maxRetries) {
            throw new Error(`Cloudflare challenge could not be bypassed after ${maxRetries} attempts. This SonarQube instance requires manual browser verification or IP whitelisting.`)
          }
          
          // Continue to next attempt
          lastError = new Error('Cloudflare challenge received')
          continue
        }

        // Try to parse as JSON
        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch {
          // Not JSON response
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${responseText.substring(0, 200)}`)
          }
          throw new Error('Invalid JSON response from SonarQube server')
        }

        if (!response.ok) {
          const status = response.status
          const statusText = response.statusText
          
          console.error(`SonarQube API error: ${status} ${statusText}`)
          console.error('Response data:', responseData)
          
          if (status === 401) {
            throw new Error(`Authentication failed: Invalid token or insufficient permissions`)
          } else if (status === 403) {
            throw new Error(`Access forbidden: Check your permissions and organization settings. This may also indicate Cloudflare protection that requires IP whitelisting.`)
          } else if (status === 404) {
            throw new Error(`SonarQube server not found: Verify the server URL`)
          } else if (status === 429) {
            if (attempt < maxRetries) {
              console.log(`Rate limited, will retry attempt ${attempt + 1}`)
              lastError = new Error('Rate limited')
              continue
            }
            throw new Error(`Rate limit exceeded: Too many requests. Please wait before trying again.`)
          } else if (status === 503) {
            if (attempt < maxRetries) {
              console.log(`Service unavailable, will retry attempt ${attempt + 1}`)
              lastError = new Error('Service unavailable')
              continue
            }
            throw new Error(`Service unavailable: SonarQube server may be under maintenance or in Cloudflare "Under Attack" mode.`)
          } else {
            throw new Error(`SonarQube API error: ${status} ${statusText}`)
          }
        }

        console.log(`Success on attempt ${attempt}`)
        return responseData

      } catch (error) {
        lastError = error as Error
        console.error(`Attempt ${attempt} failed:`, error)
        
        // Don't retry for certain errors
        if (error instanceof Error) {
          if (error.message.includes('Authentication failed') || 
              error.message.includes('Invalid token') ||
              error.message.includes('server not found')) {
            throw error
          }
        }
        
        if (attempt === maxRetries) {
          break
        }
      }
    }
    
    // All attempts failed
    const finalError = lastError || new Error('Unknown error')
    
    if (finalError.message.includes('Cloudflare challenge')) {
      throw new Error(`Unable to bypass Cloudflare protection for ${baseUrl}. This SonarQube instance requires one of the following:

1. **IP Whitelisting**: Ask your SonarQube admin to whitelist your server's IP address
2. **VPN/Proxy**: Use a VPN or proxy service to access the instance
3. **Browser Access**: Access SonarQube directly in your browser first to complete the challenge
4. **Cloudflare Settings**: Ask admin to adjust Cloudflare security settings

The server is protected by Cloudflare's "Under Attack" mode or JavaScript challenge.`)
    }
    
    throw finalError
}

function getRotatingUserAgent(attempt: number): string {
  const agents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  ]
  return agents[(attempt - 1) % agents.length]
}
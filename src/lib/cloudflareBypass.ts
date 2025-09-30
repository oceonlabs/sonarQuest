// Cloudflare bypass utilities
import { CloudflareDetector } from './cloudflareDetector'

export class CloudflareBypass {
  private static requestCount = 0
  private static lastRequestTime = 0
  private static detectionCache = new Map<string, any>()
  
  /**
   * Automatically detect and apply appropriate bypass strategy
   */
  static async makeCloudflareAwareRequest(
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    // Check if we've already detected this domain
    const domain = new URL(url).origin
    let detection = this.detectionCache.get(domain)
    
    if (!detection) {
      console.log('Detecting Cloudflare protection for:', domain)
      detection = await CloudflareDetector.detectCloudflare(domain)
      this.detectionCache.set(domain, detection)
      
      if (detection.isCloudflare) {
        console.log('Cloudflare detected:', detection)
        const recommendations = CloudflareDetector.getBypassRecommendations(detection)
        console.log('Applying automatic bypass strategies:', recommendations.strategies.filter(s => s.automatic))
      }
    }
    
    // Apply automatic strategies
    if (detection.isCloudflare) {
      return await this.retryRequest(
        async () => {
          await this.addRequestDelay()
          return fetch(url, {
            ...options,
            headers: {
              ...this.getCloudflareHeaders(domain, ''),
              ...options.headers
            }
          })
        },
        detection.protectionLevel === 'challenge' ? 5 : 3
      )
    } else {
      // Direct request for non-Cloudflare URLs
      return fetch(url, options)
    }
  }
  
  /**
   * Add delays between requests to avoid triggering rate limiting
   */
  static async addRequestDelay() {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    const minDelay = 1000 + Math.random() * 2000 // 1-3 seconds random delay
    
    if (timeSinceLastRequest < minDelay) {
      const delay = minDelay - timeSinceLastRequest
      console.log(`Adding ${delay}ms delay to avoid Cloudflare detection`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
    
    this.lastRequestTime = Date.now()
    this.requestCount++
  }
  
  /**
   * Get enhanced headers for bypassing Cloudflare
   */
  static getCloudflareHeaders(baseUrl: string, token: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      // Rotate user agents to avoid detection
      'User-Agent': this.getRandomUserAgent(),
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,de;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"macOS"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      // Add session persistence
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    }
    
    // Add authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // Only add origin/referer if we have a valid URL
    try {
      const url = new URL(baseUrl)
      headers['Referer'] = url.origin
      headers['Origin'] = url.origin
    } catch {
      // Invalid URL, skip origin headers
    }
    
    return headers
  }
  
  /**
   * Retry logic for Cloudflare-protected endpoints
   */
  static async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries = 3,
    backoffMultiplier = 2
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.addRequestDelay()
        return await requestFn()
      } catch (error) {
        lastError = error as Error
        console.log(`Request attempt ${attempt} failed:`, error)
        
        // Check if it's a Cloudflare-related error
        if (this.isCloudflareError(error)) {
          const delay = 1000 * Math.pow(backoffMultiplier, attempt - 1) + Math.random() * 1000
          console.log(`Waiting ${delay}ms before retry ${attempt + 1}`)
          await new Promise(resolve => setTimeout(resolve, delay))
        } else {
          // Non-Cloudflare error, don't retry
          throw error
        }
      }
    }
    
    throw lastError!
  }
  
  private static isCloudflareError(error: any): boolean {
    if (!error) return false
    
    const message = error.message?.toLowerCase() || ''
    const status = error.status || 0
    
    return (
      status === 403 ||
      status === 429 ||
      status === 503 ||
      message.includes('cloudflare') ||
      message.includes('access denied') ||
      message.includes('rate limit') ||
      message.includes('too many requests') ||
      message.includes('checking your browser')
    )
  }
  
  private static getRandomUserAgent(): string {
    const agents = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    ]
    return agents[this.requestCount % agents.length]
  }
}
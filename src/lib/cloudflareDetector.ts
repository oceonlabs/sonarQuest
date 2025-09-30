// Cloudflare detection and automatic bypass strategies
export class CloudflareDetector {
  /**
   * Detect if a URL is protected by Cloudflare (server-side safe method)
   */
  static async detectCloudflare(url: string): Promise<{
    isCloudflare: boolean
    protectionLevel: 'none' | 'basic' | 'under-attack' | 'challenge'
    recommendedStrategy: string[]
  }> {
    try {
      // Since we can't make direct requests from client due to CORS,
      // we'll use heuristics and known patterns for the domain
      const domain = new URL(url).hostname.toLowerCase()
      
      // Check if it's likely behind Cloudflare based on domain patterns
      const cloudflareIndicators = [
        'cloudflareaccess.com',
        '.cloudflare.com',
        // Add more known Cloudflare-protected patterns if needed
      ]
      
      const isLikelyCloudflare = cloudflareIndicators.some(indicator => 
        domain.includes(indicator)
      )
      
      // For now, assume any HTTPS site might have Cloudflare protection
      // This is a conservative approach since we can't test directly
      const isHttps = url.toLowerCase().startsWith('https://')
      
      if (isLikelyCloudflare || isHttps) {
        return {
          isCloudflare: true,
          protectionLevel: 'basic', // Conservative assumption
          recommendedStrategy: ['enhanced-headers', 'user-agent-rotation', 'delay-requests']
        }
      }
      
      return {
        isCloudflare: false,
        protectionLevel: 'none',
        recommendedStrategy: ['direct']
      }
      
    } catch (error) {
      console.warn('Could not analyze URL for Cloudflare protection:', error)
      // Default to assuming protection exists for safety
      return {
        isCloudflare: true,
        protectionLevel: 'basic',
        recommendedStrategy: ['enhanced-headers', 'user-agent-rotation']
      }
    }
  }
  
  /**
   * Analyze error responses to detect Cloudflare protection level
   */
  static analyzeErrorResponse(errorMessage: string, responseHtml?: string): {
    isCloudflare: boolean
    protectionLevel: 'none' | 'basic' | 'under-attack' | 'challenge'
    recommendedStrategy: string[]
  } {
    const message = errorMessage.toLowerCase()
    const html = (responseHtml || '').toLowerCase()
    
    // Check for Cloudflare indicators in response
    const cloudflareIndicators = [
      'just a moment',
      'challenge-platform',
      'cf-browser-verification',
      'ddos protection by cloudflare',
      'cloudflare',
      'cf-ray',
      'cf-',
      'checking your browser'
    ]
    
    const hasCloudflareIndicators = cloudflareIndicators.some(indicator => 
      message.includes(indicator) || html.includes(indicator)
    )
    
    if (!hasCloudflareIndicators) {
      return {
        isCloudflare: false,
        protectionLevel: 'none',
        recommendedStrategy: ['direct']
      }
    }
    
    // Determine protection level based on content
    if (html.includes('just a moment') || html.includes('challenge-platform')) {
      return {
        isCloudflare: true,
        protectionLevel: 'challenge',
        recommendedStrategy: ['browser-simulation', 'delay-requests', 'ip-whitelisting', 'manual-intervention']
      }
    } else if (message.includes('503') || message.includes('under attack')) {
      return {
        isCloudflare: true,
        protectionLevel: 'under-attack',
        recommendedStrategy: ['enhanced-headers', 'delay-requests', 'retry-with-backoff', 'ip-whitelisting']
      }
    } else if (message.includes('403') || message.includes('access denied')) {
      return {
        isCloudflare: true,
        protectionLevel: 'basic',
        recommendedStrategy: ['enhanced-headers', 'user-agent-rotation', 'retry-with-backoff']
      }
    }
    
    return {
      isCloudflare: true,
      protectionLevel: 'basic',
      recommendedStrategy: ['enhanced-headers', 'user-agent-rotation']
    }
  }
  
  /**
   * Get bypass recommendations based on detection
   */
  static getBypassRecommendations(detection: Awaited<ReturnType<typeof CloudflareDetector.detectCloudflare>>) {
    const recommendations = {
      title: 'Cloudflare Bypass Recommendations',
      level: detection.protectionLevel,
      strategies: [] as Array<{
        name: string
        description: string
        difficulty: 'easy' | 'medium' | 'hard'
        automatic: boolean
      }>
    }
    
    if (detection.protectionLevel === 'none') {
      recommendations.strategies.push({
        name: 'Direct Connection',
        description: 'No Cloudflare protection detected. Use direct connection.',
        difficulty: 'easy',
        automatic: true
      })
    } else {
      // Automatic strategies (built into the app)
      recommendations.strategies.push(
        {
          name: 'Enhanced Headers',
          description: 'Use realistic browser headers and timing (automatic)',
          difficulty: 'easy',
          automatic: true
        },
        {
          name: 'Request Delays',
          description: 'Add random delays between requests (automatic)',
          difficulty: 'easy',
          automatic: true
        }
      )
      
      if (detection.protectionLevel === 'under-attack' || detection.protectionLevel === 'challenge') {
        // Manual strategies for heavy protection
        recommendations.strategies.push(
          {
            name: 'Browser Extension',
            description: 'Use browser extensions like User-Agent Switcher or Proxy SwitchyOmega',
            difficulty: 'medium',
            automatic: false
          },
          {
            name: 'Local Proxy',
            description: 'Set up a local proxy (mitmproxy, Charles) to modify requests',
            difficulty: 'medium',
            automatic: false
          },
          {
            name: 'VPN/Different IP',
            description: 'Use VPN or different network connection',
            difficulty: 'easy',
            automatic: false
          },
          {
            name: 'Contact Admin',
            description: 'Ask SonarQube admin to whitelist your IP address',
            difficulty: 'easy',
            automatic: false
          }
        )
      }
    }
    
    return recommendations
  }
}
import { useState, useEffect } from 'react'
import { CloudflareDetector } from '../lib/cloudflareDetector'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

interface CloudflareStatusProps {
  sonarQubeUrl: string
}

export function CloudflareStatus({ sonarQubeUrl }: CloudflareStatusProps) {
  const [detection, setDetection] = useState<any>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [recommendations, setRecommendations] = useState<any>(null)

  const checkCloudflareStatus = async () => {
    if (!sonarQubeUrl) return

    setIsChecking(true)
    try {
      // First do a basic detection
      const result = await CloudflareDetector.detectCloudflare(sonarQubeUrl)
      setDetection(result)
      
      // Also try to get more info from the connection test (this will likely fail due to CORS)
      // but we can catch and analyze the error
      try {
        const response = await fetch(sonarQubeUrl, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(3000)
        })
        
        // If we get here, update the detection with real data
        const headers = response.headers
        const cfRay = headers.get('cf-ray')
        const cfCache = headers.get('cf-cache-status')
        const server = headers.get('server')?.toLowerCase() || ''
        
        if (cfRay || cfCache || server.includes('cloudflare')) {
          result.isCloudflare = true
          result.protectionLevel = response.status === 403 ? 'under-attack' : 'basic'
        }
      } catch (corsError) {
        // CORS error is expected, but we can still analyze the error
        if (corsError instanceof Error) {
          const analysis = CloudflareDetector.analyzeErrorResponse(corsError.message)
          if (analysis.isCloudflare) {
            result.isCloudflare = true
            result.protectionLevel = analysis.protectionLevel
            result.recommendedStrategy = analysis.recommendedStrategy
          }
        }
      }
      
      setDetection(result)
      
      if (result.isCloudflare) {
        const recs = CloudflareDetector.getBypassRecommendations(result)
        setRecommendations(recs)
      }
    } catch (error) {
      console.error('Failed to check Cloudflare status:', error)
      // Fallback to basic detection
      setDetection({
        isCloudflare: true,
        protectionLevel: 'basic',
        recommendedStrategy: ['enhanced-headers', 'user-agent-rotation']
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    if (sonarQubeUrl && sonarQubeUrl !== 'https://your-oracle-sonarqube.com') {
      checkCloudflareStatus()
    }
  }, [sonarQubeUrl])

  if (!sonarQubeUrl || sonarQubeUrl === 'https://your-oracle-sonarqube.com') {
    return null
  }

  const getProtectionBadge = (level: string) => {
    const variants = {
      'none': 'default',
      'basic': 'secondary',
      'under-attack': 'destructive',
      'challenge': 'destructive'
    } as const
    
    return (
      <Badge variant={variants[level as keyof typeof variants] || 'default'}>
        {level === 'none' ? 'No Protection' : 
         level === 'basic' ? 'Basic Protection' :
         level === 'under-attack' ? 'Under Attack Mode' :
         level === 'challenge' ? 'Challenge Mode' : level}
      </Badge>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Cloudflare Status
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkCloudflareStatus}
            disabled={isChecking}
          >
            {isChecking ? 'Checking...' : 'Refresh'}
          </Button>
        </CardTitle>
        <CardDescription>
          Connection analysis for {sonarQubeUrl}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {detection ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Cloudflare Protection:</span>
              <div className="flex items-center gap-2">
                {detection.isCloudflare ? (
                  <>
                    <Badge variant="secondary">Detected</Badge>
                    {getProtectionBadge(detection.protectionLevel)}
                  </>
                ) : (
                  <Badge variant="default">Not Detected</Badge>
                )}
              </div>
            </div>

            {recommendations && (
              <div className="space-y-3">
                <h4 className="font-medium">Recommended Strategies:</h4>
                <div className="space-y-2">
                  {recommendations.strategies.map((strategy: any, index: number) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        strategy.automatic ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {strategy.name}
                          {strategy.automatic && (
                            <Badge variant="default" className="text-xs">Auto</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{strategy.description}</div>
                      </div>
                      <Badge 
                        variant={strategy.difficulty === 'easy' ? 'default' : 
                                strategy.difficulty === 'medium' ? 'secondary' : 'destructive'}
                      >
                        {strategy.difficulty}
                      </Badge>
                    </div>
                  ))}
                </div>

                {recommendations.strategies.some((s: any) => !s.automatic) && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium text-yellow-800">Manual Setup Required</div>
                    <div className="text-sm text-yellow-700 mt-1">
                      Some strategies require manual configuration. See the documentation for detailed setup instructions.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {isChecking ? 'Analyzing connection...' : 'Click Refresh to check Cloudflare status'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
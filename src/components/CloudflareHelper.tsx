import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

interface CloudflareHelperProps {
  errorMessage: string
  sonarQubeUrl: string
  onRetry: () => void
}

export function CloudflareHelper({ errorMessage, sonarQubeUrl, onRetry }: CloudflareHelperProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Analyze the error to determine if it's Cloudflare-related
  const isCloudflareError = errorMessage.toLowerCase().includes('just a moment') ||
    errorMessage.toLowerCase().includes('cloudflare') ||
    errorMessage.toLowerCase().includes('challenge') ||
    errorMessage.toLowerCase().includes('access forbidden')

  if (!isCloudflareError) {
    return null
  }

  const quickSolutions = [
    {
      title: "🔄 Automatic Retry",
      description: "The app will automatically retry with enhanced headers and delays",
      action: "Automatic"
    },
    {
      title: "🌐 Try VPN",
      description: "Use a VPN to connect from a different location",
      action: "Manual"
    },
    {
      title: "🕐 Wait and Retry",
      description: "Wait 5-10 minutes and try again (Cloudflare may lift restrictions)",
      action: "Manual"
    }
  ]

  const advancedSolutions = [
    {
      title: "📧 Contact Admin",
      description: "Ask your SonarQube admin to whitelist your IP address in Cloudflare",
      action: "Contact Admin"
    },
    {
      title: "🌐 Browser First",
      description: "Open SonarQube in your browser first to complete any challenges",
      action: "Manual"
    },
    {
      title: "⚙️ Proxy Setup",
      description: "Set up a local proxy (mitmproxy, Charles) to modify requests",
      action: "Technical"
    },
    {
      title: "🔧 Corporate Network",
      description: "If on corporate network, check if there's an internal proxy to use",
      action: "Network Admin"
    }
  ]

  return (
    <Card className="mt-4 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          🛡️ Cloudflare Protection Detected
          <Badge variant="destructive">Challenge Mode</Badge>
        </CardTitle>
        <CardDescription className="text-orange-700">
          Your SonarQube instance at <code className="bg-orange-100 px-1 rounded">{sonarQubeUrl}</code> is protected by Cloudflare's "Under Attack" mode or JavaScript challenge.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-orange-800 mb-2">Quick Solutions (Try First):</h4>
          <div className="space-y-2">
            {quickSolutions.map((solution, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-orange-200 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{solution.title}</div>
                  <div className="text-sm text-gray-600">{solution.description}</div>
                </div>
                <Badge variant={solution.action === 'Automatic' ? 'default' : 'secondary'}>
                  {solution.action}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onRetry} 
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            🔄 Retry Connection
          </Button>
          <Button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="outline"
            size="sm"
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Button>
        </div>

        {showAdvanced && (
          <div>
            <h4 className="font-medium text-orange-800 mb-2">Advanced Solutions:</h4>
            <div className="space-y-2">
              {advancedSolutions.map((solution, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border border-orange-200 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{solution.title}</div>
                    <div className="text-sm text-gray-600">{solution.description}</div>
                  </div>
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    {solution.action}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="font-medium text-blue-800 text-sm">💡 Why is this happening?</div>
              <div className="text-sm text-blue-700 mt-1">
                Cloudflare's "Under Attack" mode requires JavaScript execution and browser verification to prevent DDoS attacks. 
                Server-to-server requests (like ours) can't complete these challenges automatically.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
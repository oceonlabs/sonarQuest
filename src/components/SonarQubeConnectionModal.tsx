import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Badge } from './ui/badge'
import { configService } from '../lib/configService'
import { dataService } from '../lib/dataService'
import { CloudflareStatus } from './CloudflareStatus'
import { CloudflareHelper } from './CloudflareHelper'

interface ConnectionModalProps {
  trigger: React.ReactNode
}

export function SonarQubeConnectionModal({ trigger }: ConnectionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    baseUrl: '',
    token: '',
    organization: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isConnected, setIsConnected] = useState(configService.getConfig().isConnected)
  const [isConfiguredViaEnv, setIsConfiguredViaEnv] = useState(configService.getConfig().isConfiguredViaEnv)
  const [hasExistingToken, setHasExistingToken] = useState(false)

  // Subscribe to config changes
  useEffect(() => {
    const unsubscribe = configService.subscribe((config) => {
      setIsConnected(config.isConnected)
      setIsConfiguredViaEnv(config.isConfiguredViaEnv)
      setHasExistingToken(!!config.token)
      if (config.isConnected || config.isConfiguredViaEnv) {
        // Never load the actual token into form state for security
        setFormData({
          baseUrl: config.baseUrl,
          token: '', // Leave empty to avoid exposing in DOM
          organization: config.organization || ''
        })
      }
    })
    return unsubscribe
  }, [])

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    setTestResult(null) // Clear test result when form changes
  }

  const handleTestConnection = async () => {
    if (!formData.baseUrl.trim()) {
      setTestResult({
        success: false,
        message: 'Please provide a URL'
      })
      return
    }

    // Use existing token if user hasn't entered a new one
    const tokenToTest = formData.token.trim() || (hasExistingToken ? configService.getConfig().token : '')
    
    if (!tokenToTest) {
      setTestResult({
        success: false,
        message: 'Please provide a token'
      })
      return
    }

    setIsLoading(true)
    setTestResult(null)

    try {
      const result = await dataService.testConnection(
        formData.baseUrl.trim(),
        tokenToTest,
        formData.organization.trim() || undefined
      )
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to test connection'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = () => {
    if (!testResult?.success) {
      handleTestConnection()
      return
    }

    // Use existing token if user hasn't entered a new one
    const tokenToUse = formData.token.trim() || (hasExistingToken ? configService.getToken() : '')

    configService.connectToSonarQube(
      formData.baseUrl.trim(),
      tokenToUse,
      formData.organization.trim() || undefined
    )
    setIsOpen(false)
  }

  const handleDisconnect = () => {
    configService.disconnectFromSonarQube()
    setFormData({ baseUrl: '', token: '', organization: '' })
    setTestResult(null)
    setIsOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && (isConnected || isConfiguredViaEnv)) {
      // Load current config when opening if connected or configured via env
      // But never load the token for security reasons
      const config = configService.getConfig()
      setFormData({
        baseUrl: config.baseUrl,
        token: '', // Never expose token in form state
        organization: config.organization || ''
      })
      setHasExistingToken(!!config.token)
    } else if (!open) {
      // Reset form when closing if not connected
      if (!isConnected && !isConfiguredViaEnv) {
        setFormData({ baseUrl: '', token: '', organization: '' })
        setTestResult(null)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isConfiguredViaEnv ? 'SonarQube Configuration (Environment)' : 
             isConnected ? 'SonarQube Connection' : 'Connect to SonarQube'}
          </DialogTitle>
          <DialogDescription>
            {isConfiguredViaEnv 
              ? 'Configuration is managed via environment variables (.env file). Changes must be made in the .env file and require an application restart.'
              : isConnected 
                ? 'Manage your SonarQube connection settings.'
                : 'Configure your SonarQube server connection to start using real data.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 overflow-y-auto">
          {isConnected && (
            <div className="mb-4">
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                {isConfiguredViaEnv ? 'Configured via Environment' : 'Connected'}
              </Badge>
            </div>
          )}
          
          {isConfiguredViaEnv && (
            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800 border border-blue-200">
              <p className="font-semibold mb-2">ℹ️ Environment Configuration Active</p>
              <p>
                Your SonarQube connection is configured via environment variables. 
                To change these settings, update your <code className="bg-blue-100 px-1 rounded">.env</code> file 
                and restart the application.
              </p>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="baseUrl">SonarQube Server URL *</Label>
            <Input
              id="baseUrl"
              placeholder="https://your-sonarqube-instance.com"
              value={formData.baseUrl}
              onChange={handleInputChange('baseUrl')}
              disabled={isConfiguredViaEnv}
              className={isConfiguredViaEnv ? 'bg-gray-100' : ''}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="token">User Token *</Label>
            <Input
              id="token"
              type="password"
              placeholder={hasExistingToken && !formData.token ? "••••••••••••••••" : "Your SonarQube user token"}
              value={formData.token}
              onChange={handleInputChange('token')}
              disabled={isConfiguredViaEnv}
              className={isConfiguredViaEnv ? 'bg-gray-100' : ''}
            />
            {!isConfiguredViaEnv && (
              <p className="text-xs text-gray-500">
                {hasExistingToken && !formData.token 
                  ? "Token is saved. Leave empty to keep current token or enter a new one."
                  : "Generate in SonarQube: Account → Security → Tokens"}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="organization">Organization (optional)</Label>
            <Input
              id="organization"
              placeholder="your-organization-key"
              value={formData.organization}
              onChange={handleInputChange('organization')}
              disabled={isConfiguredViaEnv}
              className={isConfiguredViaEnv ? 'bg-gray-100' : ''}
            />
          </div>
          
          {testResult && (
            <div className="mt-2">
              <Badge variant={testResult.success ? 'default' : 'destructive'}>
                {testResult.message}
              </Badge>
            </div>
          )}

          {/* Show Cloudflare status when URL is entered */}
          {formData.baseUrl && formData.baseUrl !== '' && (
            <CloudflareStatus sonarQubeUrl={formData.baseUrl} />
          )}

          {/* Show Cloudflare helper if there's an error that looks like Cloudflare */}
          {testResult && !testResult.success && !isConfiguredViaEnv && (
            <CloudflareHelper 
              errorMessage={testResult.message}
              sonarQubeUrl={formData.baseUrl}
              onRetry={handleTestConnection}
            />
          )}
        </div>
        
        <DialogFooter>
          <div className="flex gap-2 w-full sm:w-auto">
            {!isConfiguredViaEnv && isConnected && (
              <Button
                variant="destructive"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            )}
            
            {!isConfiguredViaEnv && (
              <>
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isLoading}
                >
                  {isLoading ? 'Testing...' : 'Test Connection'}
                </Button>
                
                <Button
                  onClick={handleConnect}
                  disabled={isLoading || (!testResult?.success && !isConnected)}
                >
                  {isConnected ? 'Update' : 'Connect'}
                </Button>
              </>
            )}
            
            {isConfiguredViaEnv && (
              <Button onClick={() => setIsOpen(false)}>
                Close
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
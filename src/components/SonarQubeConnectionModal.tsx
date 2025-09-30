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

  // Subscribe to config changes
  useEffect(() => {
    const unsubscribe = configService.subscribe((config) => {
      setIsConnected(config.isConnected)
      if (config.isConnected) {
        setFormData({
          baseUrl: config.baseUrl,
          token: config.token,
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
    if (!formData.baseUrl.trim() || !formData.token.trim()) {
      setTestResult({
        success: false,
        message: 'Please provide both URL and token'
      })
      return
    }

    setIsLoading(true)
    setTestResult(null)

    try {
      const result = await dataService.testConnection(
        formData.baseUrl.trim(),
        formData.token.trim(),
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

    configService.connectToSonarQube(
      formData.baseUrl.trim(),
      formData.token.trim(),
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
    if (open && isConnected) {
      // Load current config when opening if connected
      const config = configService.getConfig()
      setFormData({
        baseUrl: config.baseUrl,
        token: config.token,
        organization: config.organization || ''
      })
    } else if (!open) {
      // Reset form when closing if not connected
      if (!isConnected) {
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
            {isConnected ? 'SonarQube Connection' : 'Connect to SonarQube'}
          </DialogTitle>
          <DialogDescription>
            {isConnected 
              ? 'Manage your SonarQube connection settings.'
              : 'Configure your SonarQube server connection to start using real data.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {isConnected && (
            <div className="mb-4">
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                Connected
              </Badge>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="baseUrl">SonarQube Server URL *</Label>
            <Input
              id="baseUrl"
              placeholder="https://your-sonarqube-instance.com"
              value={formData.baseUrl}
              onChange={handleInputChange('baseUrl')}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="token">User Token *</Label>
            <Input
              id="token"
              type="password"
              placeholder="Your SonarQube user token"
              value={formData.token}
              onChange={handleInputChange('token')}
            />
            <p className="text-xs text-gray-500">
              Generate in SonarQube: Account → Security → Tokens
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="organization">Organization (optional)</Label>
            <Input
              id="organization"
              placeholder="your-organization-key"
              value={formData.organization}
              onChange={handleInputChange('organization')}
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
          {testResult && !testResult.success && (
            <CloudflareHelper 
              errorMessage={testResult.message}
              sonarQubeUrl={formData.baseUrl}
              onRetry={handleTestConnection}
            />
          )}
        </div>
        
        <DialogFooter>
          <div className="flex gap-2 w-full sm:w-auto">
            {isConnected && (
              <Button
                variant="destructive"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            )}
            
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
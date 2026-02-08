import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  mockServices, 
  mockServiceIntegrations,
  mockGlobalIntegrations
} from '@/lib/mock-data'
import { 
  Link2, 
  ChevronRight
} from 'lucide-react'

interface IntegrationsPanelProps {
  serviceId: string
}

export function IntegrationsPanel({ serviceId }: IntegrationsPanelProps) {
  const selectedService = mockServices.find(s => s.id === serviceId)
  
  // Combine service-specific and global integrations
  const serviceIntegrations = mockServiceIntegrations.filter(int => int.serviceId === serviceId)
  const globalIntegrations = mockGlobalIntegrations
  const allIntegrations = [
    ...serviceIntegrations.map(int => ({ ...int, scope: 'service' as const })),
    ...globalIntegrations.map(int => ({ ...int, scope: 'global' as const }))
  ]

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'prometheus': return '🔥'
      case 'grafana': return '📊'
      case 'slack': return '💬'
      case 'pagerduty': return '📟'
      case 'email': return '📧'
      default: return '🔌'
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Integrations</h2>
        <p className="text-muted-foreground">
          Connected tools and services for {selectedService?.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {allIntegrations.map((integration) => (
          <Card key={integration.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                    {getIntegrationIcon(integration.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{integration.name}</h3>
                      <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'}>
                        {integration.status}
                      </Badge>
                      {integration.scope === 'global' && (
                        <Badge variant="outline" className="text-xs">Global</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {'endpoint' in integration.config && integration.config.endpoint && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Endpoint:</span> {integration.config.endpoint}
                        </div>
                      )}
                      {'dashboardUrl' in integration.config && integration.config.dashboardUrl && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Dashboard:</span> 
                          <a href={integration.config.dashboardUrl} className="hover:underline text-primary" target="_blank" rel="noopener noreferrer">
                            Link ↗
                          </a>
                        </div>
                      )}
                      {'webhookUrl' in integration.config && integration.config.webhookUrl && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Webhook:</span> 
                          <span className="truncate max-w-[150px]">{integration.config.webhookUrl}</span>
                        </div>
                      )}
                      {'channel' in integration.config && integration.config.channel && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Channel:</span> #{integration.config.channel}
                        </div>
                      )}
                      {'recipients' in integration.config && integration.config.recipients && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Recipients:</span> {integration.config.recipients.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Switch 
                  checked={integration.status === 'connected'} 
                />
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  <span>Configure settings</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {allIntegrations.length === 0 && (
          <div className="col-span-2 text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
            <Link2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No integrations configured.</p>
            <Button variant="outline" className="mt-4">
              Add Integration
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

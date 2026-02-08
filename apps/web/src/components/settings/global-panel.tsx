import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  mockServices, 
  mockGlobalIntegrations
} from '@/lib/mock-data'
import { 
  ChevronRight
} from 'lucide-react'

export function GlobalPanel() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Global Integrations</h2>
        <p className="text-muted-foreground">System-wide integrations and notification channels</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockGlobalIntegrations.map((integration) => (
          <Card key={integration.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                    {integration.type === 'slack' ? '💬' : 
                     integration.type === 'email' ? '📧' : 
                     integration.type === 'pagerduty' ? '🚨' : '🔗'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{integration.name}</h3>
                      <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'}>
                        {integration.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {integration.config.workspace && (
                        <div>{integration.config.workspace}</div>
                      )}
                      {integration.config.channel && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Channel:</span> {integration.config.channel}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Switch 
                  checked={integration.status === 'connected'} 
                />
              </div>
              
              <div className="mt-4 pt-4 border-t space-y-3">
                <div>
                  <div className="text-xs font-medium uppercase text-muted-foreground mb-2">Service Filters</div>
                  <div className="flex flex-wrap gap-2">
                    {integration.serviceFilters === null ? (
                      <Badge variant="outline" className="bg-primary/5 border-primary/20">All Services</Badge>
                    ) : (
                      integration.serviceFilters.map(filterId => {
                        const serviceName = mockServices.find(s => s.id === filterId)?.name
                        return serviceName ? (
                          <Badge key={filterId} variant="outline">{serviceName}</Badge>
                        ) : null
                      })
                    )}
                    <Button variant="ghost" size="sm" className="h-5 px-2 text-xs ml-auto">Edit Filters</Button>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  <span>Configure settings</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
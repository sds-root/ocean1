import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { 
  mockServices, 
  mockCloudAccounts,
  mockServiceCloudAccounts
} from '@/lib/mock-data'
import { 
  Cloud, 
  Plus, 
  Trash2, 
  Settings2, 
  Check,
  X,
  AlertCircle,
  CloudCog,
  Database
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CloudAccountsPanelProps {
  serviceId: string
}

export function CloudAccountsPanel({ serviceId }: CloudAccountsPanelProps) {
  const [editingAccount, setEditingAccount] = useState<string | null>(null)
  const selectedService = mockServices.find(s => s.id === serviceId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Cloud Accounts</h2>
          <p className="text-muted-foreground">Manage cloud provider accounts linked to {selectedService?.name}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Link Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Link Cloud Account</DialogTitle>
              <DialogDescription>
                Connect a cloud provider account to {selectedService?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Cloud Provider</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">AWS</SelectItem>
                    <SelectItem value="gcp">GCP</SelectItem>
                    <SelectItem value="azure">Azure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Link Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {mockServiceCloudAccounts
          .filter(link => link.serviceId === serviceId)
          .map(link => {
            const account = mockCloudAccounts.find(a => a.id === link.accountId)
            if (!account) return null
            
            const otherServices = mockServiceCloudAccounts
              .filter(l => l.accountId === account.id && l.serviceId !== serviceId)
              .map(l => mockServices.find(s => s.id === l.serviceId)?.name)
              .filter(Boolean)

            return (
              <Card key={account.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-lg flex items-center justify-center",
                        account.provider === 'AWS' && "bg-orange-500/10",
                        account.provider === 'GCP' && "bg-blue-500/10",
                        account.provider === 'Azure' && "bg-blue-600/10"
                      )}>
                        <CloudCog className={cn(
                          "h-6 w-6",
                          account.provider === 'AWS' && "text-orange-600",
                          account.provider === 'GCP' && "text-blue-600",
                          account.provider === 'Azure' && "text-blue-700"
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{account.name}</h3>
                          <Badge variant={account.status === 'connected' ? 'default' : 'secondary'}>
                            {account.status}
                          </Badge>
                          {otherServices.length > 0 && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Shared with {otherServices.join(", ")}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{account.provider}</span>
                            <span>•</span>
                            <span>{account.accountId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Database className="h-3 w-3" />
                            <span>Synced: {link.resources.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingAccount(editingAccount === account.id ? null : account.id)}
                      >
                        {editingAccount === account.id ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Settings2 className="h-4 w-4 mr-2" />
                            Configure
                          </>
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {editingAccount === account.id && (
                    <div className="mt-6 pt-6 border-t space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Sync Frequency</Label>
                          <Select defaultValue="5min">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1min">Every minute</SelectItem>
                              <SelectItem value="5min">Every 5 minutes</SelectItem>
                              <SelectItem value="15min">Every 15 minutes</SelectItem>
                              <SelectItem value="1hour">Every hour</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Resource Types</Label>
                          <Select defaultValue="all">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All resources</SelectItem>
                              <SelectItem value="compute">Compute only</SelectItem>
                              <SelectItem value="storage">Storage only</SelectItem>
                              <SelectItem value="network">Network only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <AlertCircle className="h-4 w-4" />
                          <span>Changes will affect {selectedService?.name} only</span>
                        </div>
                        <Button>
                          <Check className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        
        {mockServiceCloudAccounts.filter(link => link.serviceId === serviceId).length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Cloud className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No cloud accounts linked to this service.</p>
            <Button variant="link" className="mt-2">Link an existing account</Button>
          </div>
        )}
      </div>
    </div>
  )
}
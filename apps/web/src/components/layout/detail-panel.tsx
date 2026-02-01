import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { type ResourceNode, type Ticket } from "@/lib/mock-data"
import { X, Server, Database, Box, User } from "lucide-react"
import { cn } from "@/lib/utils"

type DetailItem = ResourceNode | Ticket

interface DetailPanelProps {
  item: DetailItem | null
  onClose: () => void
  className?: string
}

export function DetailPanel({ item, onClose, className }: DetailPanelProps) {
  if (!item) return null

  const isResource = (item: DetailItem): item is ResourceNode => {
    return 'type' in item && (item.type === 'resource' || item.type === 'folder')
  }


  return (
    <div className={cn("w-80 flex flex-col border-l bg-background h-full", className)}>
      <div className="p-4 border-b h-14 flex items-center justify-between">
        <h2 className="font-semibold text-sm truncate pr-2">
          {isResource(item) ? item.name : (item as Ticket).title}
        </h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {isResource(item) ? (
          <ResourceDetails node={item} />
        ) : (
          <TicketDetails ticket={item as Ticket} />
        )}
      </ScrollArea>
    </div>
  )
}

function ResourceDetails({ node }: { node: ResourceNode }) {
  if (node.type === 'folder') {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        Select a resource to view details.
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ResourceIcon type={node.resourceType} className="h-10 w-10 text-muted-foreground/50" />
          <div>
            <div className="text-xs text-muted-foreground uppercase font-bold">{node.resourceType}</div>
            <div className="text-sm font-medium">{node.name}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusBadge status={node.status} />
          <span className="text-xs text-muted-foreground">ID: {node.id}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Properties</h3>
        <div className="grid gap-3 text-sm">
          <DetailRow label="IP Address" value={node.details?.ip} />
          <DetailRow label="Region" value={node.details?.region} />
          <DetailRow label="Uptime" value={node.details?.uptime} />
          <DetailRow label="CPU Usage" value={node.details?.cpu} />
          <DetailRow label="Memory" value={node.details?.memory} />
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="logs">
        <TabsList className="w-full">
          <TabsTrigger value="logs" className="flex-1">Logs</TabsTrigger>
          <TabsTrigger value="metrics" className="flex-1">Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="logs" className="pt-4">
          <div className="bg-muted/50 rounded-md p-3 text-xs font-mono space-y-1">
            <div className="text-green-500">[INFO] Server started</div>
            <div className="text-muted-foreground">[DEBUG] Health check passed</div>
            <div className="text-blue-500">[INFO] Request received /api/v1/status</div>
          </div>
        </TabsContent>
        <TabsContent value="metrics" className="pt-4">
          <div className="text-center text-sm text-muted-foreground py-4">
            Metrics chart placeholder
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TicketDetails({ ticket }: { ticket: Ticket }) {
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{ticket.id}</Badge>
          <span className="text-xs text-muted-foreground">{ticket.createdAt}</span>
        </div>
        <h3 className="font-semibold text-lg leading-tight">{ticket.title}</h3>
        <div className="flex items-center gap-2 pt-1">
          <TicketStatusBadge status={ticket.status} />
          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
            {ticket.priority}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Description</h4>
        <p className="text-sm leading-relaxed text-foreground/90">
          {ticket.description || "No description provided."}
        </p>
      </div>

      {ticket.assignee && (
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Assignee</div>
            <div className="text-sm font-medium">{ticket.assignee}</div>
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Comments</h4>
        <div className="space-y-4">
          {ticket.comments?.map((comment, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold">{comment.user[0]}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{comment.user}</span>
                  <span className="text-[10px] text-muted-foreground">{comment.time}</span>
                </div>
                <p className="text-sm text-foreground/80">{comment.text}</p>
              </div>
            </div>
          ))}
          {(!ticket.comments || ticket.comments.length === 0) && (
            <div className="text-sm text-muted-foreground italic">No comments yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function ResourceIcon({ type, className }: { type?: string; className?: string }) {
  switch (type) {
    case "ec2": return <Server className={className} />
    case "rds": return <Database className={className} />
    case "k8s": return <Box className={className} />
    default: return <Box className={className} />
  }
}

function StatusBadge({ status }: { status?: string }) {
  switch (status) {
    case "running": 
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Running</Badge>
    case "stopped": 
      return <Badge variant="secondary">Stopped</Badge>
    case "error": 
      return <Badge variant="destructive">Error</Badge>
    default: 
      return <Badge variant="outline">Unknown</Badge>
  }
}

function TicketStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "open": return <Badge variant="outline" className="text-blue-500 border-blue-500/30 bg-blue-500/5">Open</Badge>
    case "in_progress": return <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 bg-yellow-500/5">In Progress</Badge>
    case "resolved": return <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/5">Resolved
</Badge>
  }
}


function getPriorityColor(priority: string) {
  switch (priority) {
    case "high": return "text-red-500 border-red-200 bg-red-50"
    case "medium": return "text-yellow-600 border-yellow-200 bg-yellow-50"
    case "low": return "text-blue-600 border-blue-200 bg-blue-50"
    default: return ""
  }
}

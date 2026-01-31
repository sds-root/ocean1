import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { mockResources, mockTickets, type ResourceNode, type Ticket } from "@/lib/mock-data"
import type { NavMenuType } from "./primary-sidebar"
import { Folder, Server, Database, Box } from "lucide-react"
import { cn } from "@/lib/utils"

interface SecondaryPanelProps {
  selectedService: string
  activeMenu: NavMenuType
  className?: string
}

export function SecondaryPanel({
  selectedService,
  activeMenu,
  className
}: SecondaryPanelProps) {
  return (
    <div className={cn("w-80 flex flex-col border-r bg-background h-full", className)}>
      <div className="p-4 border-b h-14 flex items-center">
        <h2 className="font-semibold text-sm capitalize">{activeMenu}</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {activeMenu === "resources" && (
          <ResourceTreeView resources={mockResources[selectedService] || []} />
        )}
        {activeMenu === "tickets" && (
          <TicketListView tickets={mockTickets[selectedService] || []} />
        )}
        {(activeMenu === "monitoring" || activeMenu === "settings") && (
          <div className="text-sm text-muted-foreground text-center py-10">
            No {activeMenu} content yet.
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

function ResourceTreeView({ resources }: { resources: ResourceNode[] }) {
  if (resources.length === 0) {
    return <div className="text-sm text-muted-foreground">No resources found.</div>
  }

  return (
    <Accordion type="multiple" className="w-full">
      {resources.map((node) => (
        <ResourceNodeItem key={node.id} node={node} />
      ))}
    </Accordion>
  )
}

function ResourceNodeItem({ node }: { node: ResourceNode }) {
  if (node.type === "folder") {
    return (
      <AccordionItem value={node.id} className="border-none">
        <AccordionTrigger className="py-2 hover:no-underline hover:bg-muted/50 rounded-sm px-2">
          <div className="flex items-center gap-2 text-sm">
            <Folder className="h-4 w-4 text-blue-400" />
            <span>{node.name}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4 pb-0">
          {node.children?.map((child) => (
            <ResourceNodeItem key={child.id} node={child} />
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  // Leaf resource node
  const Icon = getResourceIcon(node.resourceType)
  const statusColor = getStatusColor(node.status)

  return (
    <div className="flex items-center gap-2 py-2 px-2 hover:bg-muted/50 rounded-sm cursor-pointer group">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm flex-1 truncate">{node.name}</span>
      <div className={cn("h-2 w-2 rounded-full", statusColor)} />
    </div>
  )
}

function TicketListView({ tickets }: { tickets: Ticket[] }) {
  if (tickets.length === 0) {
    return <div className="text-sm text-muted-foreground">No active tickets.</div>
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
          <CardHeader className="p-3 space-y-1">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="text-[10px] h-5">{ticket.id}</Badge>
              <TicketStatusBadge status={ticket.status} />
            </div>
            <CardTitle className="text-sm font-medium leading-tight">
              {ticket.title}
            </CardTitle>
            <CardDescription className="text-xs flex items-center gap-2 mt-1">
              <span className={cn("capitalize", getPriorityColor(ticket.priority))}>
                {ticket.priority} priority
              </span>
              <span>•</span>
              <span>{ticket.createdAt}</span>
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

// Helpers
function getResourceIcon(type?: string) {
  switch (type) {
    case "ec2": return Server
    case "rds": return Database
    case "k8s": return Box
    default: return Box
  }
}

function getStatusColor(status?: string) {
  switch (status) {
    case "running": return "bg-green-500"
    case "stopped": return "bg-gray-400"
    case "error": return "bg-red-500"
    default: return "bg-gray-400"
  }
}

function TicketStatusBadge({ status }: { status: Ticket["status"] }) {
  switch (status) {
    case "open":
      return <Badge variant="secondary" className="text-[10px] h-5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Open</Badge>
    case "in_progress":
      return <Badge variant="secondary" className="text-[10px] h-5 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">In Progress</Badge>
    case "resolved":
      return <Badge variant="secondary" className="text-[10px] h-5 bg-green-500/10 text-green-500 hover:bg-green-500/20">Resolved</Badge>
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high": return "text-red-500"
    case "medium": return "text-yellow-500"
    case "low": return "text-blue-500"
    default: return "text-muted-foreground"
  }
}

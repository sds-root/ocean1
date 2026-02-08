import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SettingsSubmenu } from "@/components/settings/settings-submenu"
import { mockResources, mockTickets, type ResourceNode, type Ticket } from "@/lib/mock-data"
import type { NavMenuType } from "./primary-sidebar"
import { Folder, Server, Database, Box, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { type MentionItem } from "@/types/mention"

interface SecondaryPanelProps {
  selectedService: string
  activeMenu: NavMenuType
  onSelect: (item: ResourceNode | Ticket) => void
  className?: string
  activeSettingsTab?: 'accounts' | 'integrations'
  onSettingsTabChange?: (tab: 'accounts' | 'integrations') => void
  onAddMention?: (item: MentionItem) => void
}

export function SecondaryPanel({
  selectedService,
  activeMenu,
  onSelect,
  className,
  activeSettingsTab,
  onSettingsTabChange,
  onAddMention
}: SecondaryPanelProps) {
  return (
    <div className={cn("w-80 flex flex-col border-r bg-background h-full", className)}>
      <div className="p-4 border-b h-14 flex items-center">
        <h2 className="font-semibold text-sm capitalize">{activeMenu}</h2>
      </div>
      
      <ScrollArea className="flex-1">
        {activeMenu === "resources" && (
          <div className="p-4">
            <ResourceTreeView 
              resources={mockResources[selectedService] || []} 
              onSelect={onSelect}
              onAddMention={onAddMention}
            />
          </div>
        )}
        {activeMenu === "tickets" && (
          <div className="p-4">
            <TicketListView 
              tickets={mockTickets[selectedService] || []} 
              onSelect={onSelect}
              onAddMention={onAddMention}
            />
          </div>
        )}
        {activeMenu === "monitoring" && (
          <div className="p-4 text-sm text-muted-foreground text-center py-10">
            No monitoring content yet.
          </div>
        )}
        {activeMenu === "settings" && activeSettingsTab && onSettingsTabChange && (
          <SettingsSubmenu 
            activeTab={activeSettingsTab}
            onSelect={onSettingsTabChange}
          />
        )}
      </ScrollArea>
    </div>
  )
}

function ResourceTreeView({ 
  resources, 
  onSelect,
  onAddMention
}: { 
  resources: ResourceNode[], 
  onSelect: (item: ResourceNode) => void,
  onAddMention?: (item: MentionItem) => void
}) {
  if (resources.length === 0) {
    return <div className="text-sm text-muted-foreground">No resources found.</div>
  }

  return (
    <Accordion type="multiple" className="w-full">
      {resources.map((node) => (
        <ResourceNodeItem key={node.id} node={node} onSelect={onSelect} onAddMention={onAddMention} />
      ))}
    </Accordion>
  )
}

function ResourceNodeItem({ 
  node, 
  onSelect,
  onAddMention
}: { 
  node: ResourceNode, 
  onSelect: (item: ResourceNode) => void,
  onAddMention?: (item: MentionItem) => void
}) {
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
            <ResourceNodeItem key={child.id} node={child} onSelect={onSelect} onAddMention={onAddMention} />
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  // Leaf resource node
  const Icon = getResourceIcon(node.resourceType)
  const statusColor = getStatusColor(node.status)

  return (
    <div 
      className="flex items-center gap-2 py-2 px-2 hover:bg-muted/50 rounded-sm cursor-pointer group transition-colors active:bg-muted"
      onClick={() => onSelect(node)}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm flex-1 truncate">{node.name}</span>
      <div className={cn("h-2 w-2 rounded-full", statusColor)} />
      
      {onAddMention && (
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 overflow-hidden w-0 group-hover:w-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 hover:bg-background"
            onClick={(e) => {
              e.stopPropagation()
              onAddMention({ 
                id: node.id, 
                type: 'resource', 
                name: node.name, 
                original: node 
              })
            }}
          >
            <Plus className="h-3 w-3" />
            <span className="sr-only">Add to context</span>
          </Button>
        </div>
      )}
    </div>
  )
}

function TicketListView({ 
  tickets, 
  onSelect,
  onAddMention
}: { 
  tickets: Ticket[], 
  onSelect: (item: Ticket) => void,
  onAddMention?: (item: MentionItem) => void
}) {
  if (tickets.length === 0) {
    return <div className="text-sm text-muted-foreground">No active tickets.</div>
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <Card 
          key={ticket.id} 
          className="hover:bg-muted/50 cursor-pointer transition-colors active:scale-[0.98] duration-100 group relative"
          onClick={() => onSelect(ticket)}
        >
          <CardHeader className="p-3 space-y-1">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="text-[10px] h-5">{ticket.id}</Badge>
              <div className="flex items-center gap-1">
                <TicketStatusBadge status={ticket.status} />
                {onAddMention && (
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 overflow-hidden w-0 group-hover:w-5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 hover:bg-background shadow-sm border p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddMention({ 
                          id: ticket.id, 
                          type: 'ticket', 
                          name: ticket.title, 
                          original: ticket 
                        })
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
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

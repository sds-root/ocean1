import * as React from 'react'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover'
import { Folder, Server, Database, Box, Ticket as TicketIcon } from 'lucide-react'
import { mockResources, mockTickets, type ResourceNode, type Ticket } from '@/lib/mock-data'
import { type MentionItem } from '@/types/mention'

interface MentionAutocompleteProps {
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (item: MentionItem) => void
  serviceId?: string
}

export function MentionAutocomplete({
  children,
  isOpen,
  onOpenChange,
  onSelect,
  serviceId = 'svc-payment',
}: MentionAutocompleteProps) {
  const [containerRef, setContainerRef] = React.useState<HTMLDivElement | null>(null)
  
  const resources = React.useMemo(() => {
    const rootNodes = mockResources[serviceId] || []
    const flat: ResourceNode[] = []
    
    function traverse(nodes: ResourceNode[]) {
      for (const node of nodes) {
        if (node.type === 'resource') {
          flat.push(node)
        }
        if (node.children) {
          traverse(node.children)
        }
      }
    }
    traverse(rootNodes)
    return flat
  }, [serviceId])

  const tickets = React.useMemo(() => {
    return mockTickets[serviceId] || []
  }, [serviceId])

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>
        <div ref={setContainerRef} className="relative flex-1">
          {children}
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="p-0 w-[400px]"
        align="start"
        side="top"
        sideOffset={8}
      >
          <Command>
            <CommandInput placeholder="Search resources or tickets..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              
              <CommandGroup heading="Resources">
                {resources.map(res => (
                  <CommandItem 
                    key={res.id} 
                    value={`resource:${res.name}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onSelect={() => onSelect({ 
                      id: res.id, 
                      type: 'resource', 
                      name: res.name, 
                      original: res 
                    })}
                  >
                    {getResourceIcon(res.resourceType)}
                    <span className="ml-2">{res.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandGroup heading="Tickets">
                {tickets.map(ticket => (
                  <CommandItem 
                    key={ticket.id} 
                    value={`ticket:${ticket.title}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onSelect={() => onSelect({ 
                      id: ticket.id, 
                      type: 'ticket', 
                      name: ticket.title, 
                      original: ticket 
                    })}
                  >
                    <TicketIcon className="mr-2 h-4 w-4" />
                    <span>{ticket.id}: {ticket.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
    </Popover>
  )
}

function getResourceIcon(type?: string) {
  switch (type) {
    case "ec2": return <Server className="mr-2 h-4 w-4" />
    case "rds": return <Database className="mr-2 h-4 w-4" />
    case "k8s": return <Box className="mr-2 h-4 w-4" />
    default: return <Box className="mr-2 h-4 w-4" />
  }
}

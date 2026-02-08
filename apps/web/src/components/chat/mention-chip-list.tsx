import { type MentionItem } from "@/types/mention"
import { Badge } from "@/components/ui/badge"
import { X, Server, Database, Box, Ticket as TicketIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MentionChipListProps {
  mentions: MentionItem[]
  onRemove: (id: string) => void
}

export function MentionChipList({ mentions, onRemove }: MentionChipListProps) {
  if (mentions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 py-2 px-1">
      {mentions.map((item) => (
        <Badge
          key={item.id}
          variant="secondary"
          className={cn(
            "flex items-center gap-1.5 pr-1",
            item.type === 'resource' 
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300" 
              : "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300"
          )}
        >
          {item.type === 'resource' ? getResourceIcon(item.original.resourceType) : <TicketIcon className="h-3.5 w-3.5" />}
          <span>{item.name}</span>
          <button
            onClick={() => onRemove(item.id)}
            className="ml-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </button>
        </Badge>
      ))}
    </div>
  )
}

function getResourceIcon(type?: string) {
  switch (type) {
    case "ec2": return <Server className="h-3.5 w-3.5" />
    case "rds": return <Database className="h-3.5 w-3.5" />
    case "k8s": return <Box className="h-3.5 w-3.5" />
    default: return <Box className="h-3.5 w-3.5" />
  }
}
import { type ResourceNode, type Ticket } from "@/lib/mock-data"

export interface MentionResource {
  id: string
  type: 'resource'
  name: string
  original: ResourceNode
}

export interface MentionTicket {
  id: string
  type: 'ticket'
  name: string
  original: Ticket
}

export type MentionItem = MentionResource | MentionTicket

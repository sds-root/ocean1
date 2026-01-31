# Learnings & Conventions

## UI Patterns
- **Layout**: 2-column sidebar (Primary + Secondary) + Main Chat
- **Primary Sidebar**: Service context switcher, Main navigation (Resources, Tickets, etc.), User profile
- **Secondary Panel**: Context-specific content (Resource Tree, Ticket List)
- **Chat Area**: Centered chat interface with bottom input

## Data Structure (Mock)
- **Services**: ID, Name, Description
- **Resources**: Hierarchical tree (Service > Folder > Resource)
- **Tickets**: ID, Title, Status, Priority

## Tech Stack
- **Components**: shadcn/ui (Select, Accordion, Sheet, etc.)
- **State**: React useState (for now), lifting state up to Chat Page layout

import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ModeToggle } from '@/components/mode-toggle'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { PrimarySidebar, type NavMenuType } from '@/components/layout/primary-sidebar'
import { SecondaryPanel } from '@/components/layout/secondary-panel'
import { DetailPanel } from '@/components/layout/detail-panel'
import { mockServices, type ResourceNode, type Ticket } from '@/lib/mock-data'
import { 
  Send, Bot, User, Menu, Terminal
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

function ChatPage() {
  // Layout State
  const [selectedService, setSelectedService] = useState<string>("svc-payment")
  const [activeMenu, setActiveMenu] = useState<NavMenuType>("resources")
  const [selectedItem, setSelectedItem] = useState<ResourceNode | Ticket | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Chat State
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: 'http://localhost:3000/api/chat',
    body: { selectedService },
    streamProtocol: 'text', // Explicitly tell useChat to expect plain text stream
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  // Initial Greeting
  useEffect(() => {
    if (messages.length === 0) {
      const serviceName = mockServices.find(s => s.id === selectedService)?.name || "Service"
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `Hello! I'm ready to help you manage **${serviceName}**. What would you like to do?`,
        createdAt: new Date()
      }])
    }
  }, []) // Run once on mount

  // Update context when service changes
  useEffect(() => {
    if (messages.length > 0) {
      const serviceName = mockServices.find(s => s.id === selectedService)?.name || "Service"
      const contextMsg = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: `Context switched to **${serviceName}**.`,
        createdAt: new Date()
      }
      setMessages(prev => [...prev, contextMsg])
    }
    // Clear selection on service change
    setSelectedItem(null)
  }, [selectedService])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    handleSubmit(e)
  }

  const handleSelectItem = (item: ResourceNode | Ticket) => {
    setSelectedItem(item)
    // Optional: Auto-close mobile menu if item selected (if we implemented mobile detail view)
  }

  const SidebarContent = () => (
    <div className="flex h-full">
      <PrimarySidebar 
        selectedService={selectedService}
        onServiceChange={setSelectedService}
        activeMenu={activeMenu}
        onMenuChange={(menu) => {
          setActiveMenu(menu)
          setSelectedItem(null) // Clear selection when changing menu
        }}
      />
      <SecondaryPanel 
        selectedService={selectedService}
        activeMenu={activeMenu}
        onSelect={handleSelectItem}
      />
    </div>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-full border-r shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background/50">
        <header className="h-14 border-b flex items-center justify-between px-4 md:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-auto flex">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="flex items-center gap-2 md:hidden">
               <Bot className="h-6 w-6 text-primary" />
               <span className="font-semibold">Ocean1 AI</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              <span className="font-medium text-sm text-muted-foreground">Context:</span>
              <Badge variant="outline" className="font-normal">
                {mockServices.find(s => s.id === selectedService)?.name}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollRef}>
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                <Avatar className={cn("h-8 w-8 mt-1 flex items-center justify-center", msg.role === 'assistant' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  {msg.role === 'assistant' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </Avatar>
                
                <div className={cn(
                  "flex flex-col gap-2 max-w-[80%]",
                  msg.role === 'user' ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "rounded-2xl px-4 py-3 text-sm shadow-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted/50 border rounded-tl-none"
                  )}>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {msg.createdAt instanceof Date 
                      ? msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-6 border-t bg-background">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSend} className="relative flex items-center">
              <div className="absolute left-2 flex gap-1">
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                        <Terminal className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Run Command</TooltipContent>
                  </Tooltip>
                 </TooltipProvider>
              </div>
              <Input 
                value={input}
                onChange={handleInputChange}
                placeholder={`Ask about ${mockServices.find(s => s.id === selectedService)?.name}...`}
                className="pl-12 pr-12 h-12 rounded-full shadow-sm"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-1.5 h-9 w-9 rounded-full"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              Ocean1 AI can make mistakes. Please verify critical operations.
            </div>
          </div>
        </div>
      </main>

      {/* Detail Panel (Right Sidebar) */}
      {selectedItem && (
        <aside className="w-80 border-l bg-background hidden lg:block shrink-0">
          <DetailPanel 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
          />
        </aside>
      )}
    </div>
  )
}

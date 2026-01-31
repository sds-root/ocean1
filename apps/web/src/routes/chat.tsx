import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ModeToggle } from '@/components/mode-toggle'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Send, Bot, User, Plus, MessageSquare, Menu, Terminal, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function SidebarContent() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-2 font-semibold">
        <Bot className="h-6 w-6 text-primary" />
        <span>Ocean1 AI</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Button variant="secondary" className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
        
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground px-2">Recent</h4>
          <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal truncate">
            <MessageSquare className="h-4 w-4" />
            Deploy to production
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal truncate">
            <MessageSquare className="h-4 w-4" />
            Database backup issues
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal truncate">
            <MessageSquare className="h-4 w-4" />
            EC2 instance scaling
          </Button>
        </div>
      </div>

      <div className="p-4 border-t mt-auto space-y-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" asChild>
            <Link to="/login">
              <LogOut className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your DevOps AI assistant. How can I help you manage your infrastructure today?',
      timestamp: new Date()
    }
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've analyzed your request: "${input}". Here's what I found...`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg])
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r bg-muted/20 hidden md:block">
        <SidebarContent />
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="flex items-center gap-2 md:hidden">
               <Bot className="h-6 w-6 text-primary" />
               <span className="font-semibold">Ocean1 AI</span>
            </Link>
            
            <Badge variant="outline" className="hidden md:inline-flex">v1.0.0</Badge>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollRef}>
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                <Avatar className={cn("h-8 w-8 mt-1", msg.role === 'assistant' ? "bg-primary text-primary-foreground" : "bg-muted")}>
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
                    {msg.content}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Ocean1 to manage your infrastructure..." 
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
    </div>
  )
}

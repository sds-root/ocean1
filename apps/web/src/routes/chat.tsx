import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { ChatMarkdown } from '@/components/chat/chat-markdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ModeToggle } from '@/components/mode-toggle'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { PrimarySidebar, type NavMenuType } from '@/components/layout/primary-sidebar'
import { SecondaryPanel } from '@/components/layout/secondary-panel'
import { DetailPanel } from '@/components/layout/detail-panel'
import { CloudAccountsPanel } from '@/components/settings/cloud-accounts-panel'
import { IntegrationsPanel } from '@/components/settings/integrations-panel'
import { mockServices, type ResourceNode, type Ticket } from '@/lib/mock-data'
import { 
  Send, Bot, User, Menu, Terminal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMention } from '@/hooks/use-mention'
import { useSuggestions, type ResolvedSuggestion } from '@/hooks/use-suggestions'
import { MentionChipList } from '@/components/chat/mention-chip-list'
import { MentionAutocomplete } from '@/components/chat/mention-autocomplete'
import { SuggestionChips } from '@/components/chat/suggestion-chips'
import { type MentionItem } from '@/types/mention'


function SidebarContent({
  selectedService,
  onServiceChange,
  activeMenu,
  onMenuChange,
  onSelectItem,
  activeSettingsTab,
  onSettingsTabChange,
  onAddMention
}: {
  selectedService: string
  onServiceChange: (service: string) => void
  activeMenu: NavMenuType
  onMenuChange: (menu: NavMenuType) => void
  onSelectItem: (item: ResourceNode | Ticket) => void
  activeSettingsTab?: 'accounts' | 'integrations'
  onSettingsTabChange?: (tab: 'accounts' | 'integrations') => void
  onAddMention: (item: MentionItem) => void
}) {
  return (
    <div className="flex h-full">
      <PrimarySidebar 
        selectedService={selectedService}
        onServiceChange={onServiceChange}
        activeMenu={activeMenu}
        onMenuChange={onMenuChange}
      />
      <SecondaryPanel 
        selectedService={selectedService}
        activeMenu={activeMenu}
        onSelect={onSelectItem}
        activeSettingsTab={activeSettingsTab}
        onSettingsTabChange={onSettingsTabChange}
        onAddMention={onAddMention}
      />
    </div>
  )
}

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

function ChatPage() {
  // Layout State
  const [selectedService, setSelectedService] = useState<string>("svc-payment")
  const [activeMenu, setActiveMenu] = useState<NavMenuType>("resources")
  const [activeSettingsTab, setActiveSettingsTab] = useState<'accounts' | 'integrations'>('accounts')
  const [selectedItem, setSelectedItem] = useState<ResourceNode | Ticket | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mention State
  const { mentions, addMention, removeMention, clearMentions } = useMention()
  const [isMentionOpen, setIsMentionOpen] = useState(false)
  const suggestions = useSuggestions(mentions)

  // Chat State
  const { messages, input, handleInputChange, handleSubmit, setMessages, setInput, status } = useChat({
    api: 'http://localhost:3000/api/chat',
    body: { selectedService, mentions },
    streamProtocol: 'text',
  })
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
    // Clear selection and mentions on service change
    setSelectedItem(null)
    clearMentions()
  }, [selectedService])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, status])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    handleSubmit(e)
  }

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    handleInputChange(e)
    if (val.endsWith('@')) {
      setIsMentionOpen(true)
    }
  }

  const handleMentionSelect = (item: MentionItem) => {
    addMention(item)
    setIsMentionOpen(false)
    if (input.endsWith('@')) {
      setInput(input.slice(0, -1))
    }
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const handleSuggestionSelect = useCallback((suggestion: ResolvedSuggestion) => {
    setInput(suggestion.resolvedPrompt)
    setTimeout(() => {
      const form = inputRef.current?.closest('form')
      if (form) {
        form.requestSubmit()
      }
    }, 0)
  }, [setInput])

  const handleSelectItem = useCallback((item: ResourceNode | Ticket) => {
    setSelectedItem(item)
    // Optional: Auto-close mobile menu if item selected (if we implemented mobile detail view)
  }, [])

  const handleMenuChange = useCallback((menu: NavMenuType) => {
    setActiveMenu(menu)
    setSelectedItem(null) // Clear selection when changing menu
  }, [])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-full border-r shrink-0">
        <SidebarContent 
          selectedService={selectedService}
          onServiceChange={setSelectedService}
          activeMenu={activeMenu}
          onMenuChange={handleMenuChange}
          onSelectItem={handleSelectItem}
          activeSettingsTab={activeSettingsTab}
          onSettingsTabChange={setActiveSettingsTab}
          onAddMention={addMention}
        />
      </aside>

      {/* Main Content Area - Dynamic based on activeMenu */}
      {activeMenu === 'settings' ? (
        <main className="flex-1 flex flex-col min-w-0 bg-background/50 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            
            {activeSettingsTab === 'accounts' && <CloudAccountsPanel serviceId={selectedService} />}
            {activeSettingsTab === 'integrations' && <IntegrationsPanel serviceId={selectedService} />}
          </div>
        </main>
      ) : (
        /* Main Chat Area */
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
                  <SidebarContent 
                    selectedService={selectedService}
                    onServiceChange={setSelectedService}
                    activeMenu={activeMenu}
                    onMenuChange={handleMenuChange}
                    onSelectItem={handleSelectItem}
                    activeSettingsTab={activeSettingsTab}
                    onSettingsTabChange={setActiveSettingsTab}
                    onAddMention={addMention}
                  />
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

          <ScrollArea className="flex-1">
            <div className="p-4 md:p-6">
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
                      <ChatMarkdown content={msg.content} variant={msg.role === 'user' ? 'user' : 'assistant'} />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {msg.createdAt instanceof Date
                        ? msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing Indicator - only show before streaming starts */}
              {status === 'submitted' && (
                <div className="flex gap-4">
                  <Avatar className="h-8 w-8 mt-1 flex items-center justify-center bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </Avatar>
                  <div className="flex flex-col gap-2 items-start">
                    <div className="rounded-2xl px-4 py-3 text-sm shadow-sm bg-muted/50 border rounded-tl-none">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            </div>
          </ScrollArea>

          <div className="p-4 md:p-6 border-t bg-background">
            <div className="max-w-3xl mx-auto">
              <MentionChipList mentions={mentions} onRemove={removeMention} />
              <SuggestionChips suggestions={suggestions} onSelect={handleSuggestionSelect} />

              <form onSubmit={handleSend} className="relative flex items-center">
                <div className="absolute left-2 flex gap-1 z-10">
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
                
                <MentionAutocomplete 
                  isOpen={isMentionOpen} 
                  onOpenChange={setIsMentionOpen}
                  onSelect={handleMentionSelect}
                  serviceId={selectedService}
                >
                  <Input 
                    ref={inputRef}
                    value={input}
                    onChange={handleCustomInputChange}
                    placeholder={`Ask about ${mockServices.find(s => s.id === selectedService)?.name}... (Type @ to mention)`}
                    className="pl-12 pr-12 h-12 rounded-full shadow-sm w-full"
                  />
                </MentionAutocomplete>

                <Button 
                  type="submit" 
                  size="icon" 
                  className="absolute right-1.5 h-9 w-9 rounded-full z-10"
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
      )}

      {/* Detail Panel (Right Sidebar) - Only for Resources/Tickets */}
      {activeMenu !== 'settings' && selectedItem && (
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

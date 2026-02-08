import { Button } from "@/components/ui/button"
import { Cloud, Link2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type SettingsTab = 'accounts' | 'integrations'

interface SettingsSubmenuProps {
  activeTab: SettingsTab
  onSelect: (tab: SettingsTab) => void
  className?: string
}

export function SettingsSubmenu({ activeTab, onSelect, className }: SettingsSubmenuProps) {
  const menuItems = [
    { id: 'accounts', label: 'Cloud Accounts', icon: Cloud },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
  ] as const

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 py-4 px-2 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              activeTab === item.id && "bg-secondary text-secondary-foreground"
            )}
            onClick={() => onSelect(item.id)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
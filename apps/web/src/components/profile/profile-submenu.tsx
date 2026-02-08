import { Button } from "@/components/ui/button"
import { User, Bell, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export type ProfileTab = 'basic' | 'notifications' | 'preferences'

interface ProfileSubmenuProps {
  activeTab: ProfileTab
  onSelect: (tab: ProfileTab) => void
  className?: string
}

export function ProfileSubmenu({ activeTab, onSelect, className }: ProfileSubmenuProps) {
  const menuItems = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings },
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

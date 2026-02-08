import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  LayoutDashboard, 
  Ticket, 
  Activity, 
  Settings, 
  LogOut,
  User
} from "lucide-react"
import { mockServices } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@tanstack/react-router"

export type NavMenuType = "resources" | "tickets" | "monitoring" | "settings" | "profile"

interface PrimarySidebarProps {
  selectedService: string
  onServiceChange: (serviceId: string) => void
  activeMenu: NavMenuType
  onMenuChange: (menu: NavMenuType) => void
  className?: string
}

export function PrimarySidebar({
  selectedService,
  onServiceChange,
  activeMenu,
  onMenuChange,
  className
}: PrimarySidebarProps) {
  return (
    <div className={cn("w-64 flex flex-col border-r bg-muted/30 h-full", className)}>
      {/* Service Selector */}
      <div className="p-4 border-b">
        <label className="text-xs font-medium text-muted-foreground mb-2 block px-1">
          Service Context
        </label>
        <Select value={selectedService} onValueChange={onServiceChange}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Select service" />
          </SelectTrigger>
          <SelectContent>
            {mockServices.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <NavButton 
          active={activeMenu === "resources"} 
          onClick={() => onMenuChange("resources")}
          icon={<LayoutDashboard className="h-4 w-4" />}
          label="Resources"
        />
        <NavButton 
          active={activeMenu === "tickets"} 
          onClick={() => onMenuChange("tickets")}
          icon={<Ticket className="h-4 w-4" />}
          label="Tickets"
        />
        <NavButton 
          active={activeMenu === "monitoring"} 
          onClick={() => onMenuChange("monitoring")}
          icon={<Activity className="h-4 w-4" />}
          label="Monitoring"
        />
        <NavButton 
          active={activeMenu === "settings"} 
          onClick={() => onMenuChange("settings")}
          icon={<Settings className="h-4 w-4" />}
          label="Settings"
        />
      </div>

      {/* User Profile */}
      <div className="p-4 border-t mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Avatar className="h-9 w-9 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">DevOps Engineer</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert("Logged out")} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function NavButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string 
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 h-10 font-normal",
        active && "bg-secondary text-secondary-foreground shadow-sm"
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  )
}

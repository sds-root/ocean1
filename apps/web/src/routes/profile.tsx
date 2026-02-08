import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Settings2, 
  Moon,
  Globe,
  Shield,
  Mail,
  Briefcase,
  Save,
  Trash2
} from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

type ProfileTab = 'basic' | 'notifications' | 'prefs'

function ProfilePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ProfileTab>('basic')

  const handleClose = () => {
    navigate({ to: '/chat' })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClose}
            className="h-9 w-9 -ml-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Profile</h1>
        </div>
      </header>

      {/* Tabs - Below Header */}
      <div className="border-b bg-background">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'basic' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('basic')}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Basic
            </Button>
            <Button
              variant={activeTab === 'notifications' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('notifications')}
              className="gap-2"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
            <Button
              variant={activeTab === 'prefs' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('prefs')}
              className="gap-2"
            >
              <Settings2 className="h-4 w-4" />
              Prefs
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {activeTab === 'basic' && <BasicTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'prefs' && <PrefsTab />}
      </main>
    </div>
  )
}

function BasicTab() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    role: 'DevOps Engineer'
  })
  const [editedProfile, setEditedProfile] = useState(profile)

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const hasChanges = JSON.stringify(editedProfile) !== JSON.stringify(profile)

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card className="bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="text-xl">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{profile.displayName}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <p className="text-sm text-muted-foreground mt-1">{profile.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable Profile Info */}
      <Card className="bg-card">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Profile Information</h3>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Display Name
              </Label>
              <Input 
                id="displayName" 
                value={editedProfile.displayName}
                onChange={(e) => setEditedProfile({...editedProfile, displayName: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input 
                id="email" 
                type="email"
                value={editedProfile.email}
                onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
              {isEditing && (
                <p className="text-xs text-muted-foreground">Changing email will require verification</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Role
              </Label>
              <Input 
                id="role" 
                value={editedProfile.role}
                onChange={(e) => setEditedProfile({...editedProfile, role: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleSave} 
                disabled={!hasChanges}
                className="flex-1 gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border-destructive/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-destructive flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationsTab() {
  return (
    <Card className="bg-card">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base">Email Alerts</Label>
            </div>
            <p className="text-sm text-muted-foreground">Receive daily summaries via email</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base">Security Alerts</Label>
            </div>
            <p className="text-sm text-muted-foreground">Get notified about suspicious activities</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base">Slack Notifications</Label>
            </div>
            <p className="text-sm text-muted-foreground">Get instant alerts on Slack</p>
          </div>
          <Switch />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base">Ticket Updates</Label>
            </div>
            <p className="text-sm text-muted-foreground">Notifications when tickets are updated</p>
          </div>
          <Switch defaultChecked />
        </div>
      </CardContent>
    </Card>
  )
}

function PrefsTab() {
  return (
    <Card className="bg-card">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base">Compact Mode</Label>
            </div>
            <p className="text-sm text-muted-foreground">Reduce spacing and padding throughout the interface</p>
          </div>
          <Switch />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base">Show Resource IDs</Label>
            </div>
            <p className="text-sm text-muted-foreground">Display cloud resource IDs in lists</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            Timezone
          </Label>
          <Input defaultValue="UTC" />
          <p className="text-xs text-muted-foreground">All times will be displayed in this timezone</p>
        </div>
      </CardContent>
    </Card>
  )
}
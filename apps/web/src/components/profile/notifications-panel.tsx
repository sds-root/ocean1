import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function NotificationsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage how you receive alerts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Alerts</Label>
            <p className="text-sm text-muted-foreground">Receive daily summaries via email.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Slack Notifications</Label>
            <p className="text-sm text-muted-foreground">Get instant alerts on Slack.</p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  )
}

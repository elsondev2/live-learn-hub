import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Bell, Mail, MessageSquare, BookOpen, Users } from 'lucide-react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState<NotificationSetting[]>([
    {
      id: 'new-content',
      title: 'New Content Alerts',
      description: 'Get notified when new notes, mind maps, or audio lessons are shared',
      icon: <BookOpen className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'assignments',
      title: 'Assignment Updates',
      description: 'Receive notifications about new assignments and deadlines',
      icon: <Bell className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'comments',
      title: 'Comments & Mentions',
      description: 'Get notified when someone comments or mentions you',
      icon: <MessageSquare className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'collaborations',
      title: 'Collaboration Invites',
      description: 'Receive invites to collaborate on projects',
      icon: <Users className="h-5 w-5" />,
      enabled: false,
    },
  ]);

  const [pushNotifications, setPushNotifications] = useState<NotificationSetting[]>([
    {
      id: 'push-messages',
      title: 'Direct Messages',
      description: 'Instant notifications for new messages',
      icon: <MessageSquare className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'push-updates',
      title: 'Important Updates',
      description: 'Critical updates and announcements',
      icon: <Bell className="h-5 w-5" />,
      enabled: true,
    },
  ]);

  const handleEmailToggle = (id: string, enabled: boolean) => {
    setEmailNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, enabled } : notif)
    );
    toast.success(enabled ? 'Email notification enabled' : 'Email notification disabled');
  };

  const handlePushToggle = (id: string, enabled: boolean) => {
    setPushNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, enabled } : notif)
    );
    toast.success(enabled ? 'Push notification enabled' : 'Push notification disabled');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>Manage how you receive email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailNotifications.map((notification) => (
            <div key={notification.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex gap-3 flex-1">
                <div className="mt-1 text-muted-foreground">
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <Label htmlFor={notification.id} className="font-medium cursor-pointer">
                    {notification.title}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.description}
                  </p>
                </div>
              </div>
              <Switch
                id={notification.id}
                checked={notification.enabled}
                onCheckedChange={(enabled) => handleEmailToggle(notification.id, enabled)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>Manage browser and mobile push notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pushNotifications.map((notification) => (
            <div key={notification.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex gap-3 flex-1">
                <div className="mt-1 text-muted-foreground">
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <Label htmlFor={notification.id} className="font-medium cursor-pointer">
                    {notification.title}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.description}
                  </p>
                </div>
              </div>
              <Switch
                id={notification.id}
                checked={notification.enabled}
                onCheckedChange={(enabled) => handlePushToggle(notification.id, enabled)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Frequency</CardTitle>
          <CardDescription>Choose how often you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Digest Mode</p>
              <p className="text-sm text-muted-foreground mt-1">
                Receive a daily summary instead of individual notifications
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Do Not Disturb</p>
              <p className="text-sm text-muted-foreground mt-1">
                Pause all notifications during specific hours
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Upload, User, Lock, Bell, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { MobileContainer } from '@/components/MobileOptimized';
import { uploadFile, getPublicUrl } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function AccountSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileName = `${user._id}-${Date.now()}.${file.name.split('.').pop()}`;
      await uploadFile('avatars', fileName, file);
      const url = getPublicUrl('avatars', fileName);
      setProfileImage(url);
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const tabs = [
    { path: '/settings/profile', label: 'Profile', icon: User },
    { path: '/settings/security', label: 'Security', icon: Lock },
    { path: '/settings/notifications', label: 'Notifications', icon: Bell },
    { path: '/settings/appearance', label: 'Appearance', icon: Palette },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md shadow-sm">
        <MobileContainer>
          <div className="flex h-16 items-center justify-between">
            <Button variant="outline" onClick={() => navigate('/dashboard')} size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <h1 className="text-lg sm:text-xl font-bold">Account Settings</h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </MobileContainer>
      </div>

      <MobileContainer className="py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Profile Card - Mobile Optimized */}
          <Card className="lg:sticky lg:top-24 h-fit">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 relative">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback className="text-2xl sm:text-3xl bg-gradient-to-br from-primary to-accent text-white">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                >
                  <Upload className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              <CardTitle className="text-xl sm:text-2xl">{user?.name}</CardTitle>
              <CardDescription className="break-all">{user?.email}</CardDescription>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {user?.role === 'TEACHER' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
                </span>
              </div>
            </CardHeader>
          </Card>

          {/* Settings Navigation & Content */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentPath === tab.path;
                return (
                  <Link key={tab.path} to={tab.path}>
                    <Button
                      variant={isActive ? 'default' : 'outline'}
                      className={cn(
                        'w-full gap-2 py-6',
                        isActive && 'shadow-md'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Tab Content */}
            <Outlet />
          </div>
        </div>
      </MobileContainer>
    </div>
  );
}

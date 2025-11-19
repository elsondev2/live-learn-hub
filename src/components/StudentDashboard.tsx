import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, BookOpen, Music, Network, Sparkles, Settings } from 'lucide-react';
import { NotesList } from './NotesList';
import { AudioLessonsList } from './AudioLessonsList';
import { MindMapsList } from './MindMapsList';
import { ThemeToggle } from './ThemeToggle';

export function StudentDashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white dark:bg-card p-1.5 shadow-lg ring-2 ring-primary/20">
              <img src="/logo.png" alt="Unicate Logo" className="h-full w-full object-contain rounded-full" />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Unicate
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/settings'}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={signOut} className="hidden sm:flex">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
            <Button variant="outline" size="icon" onClick={signOut} className="sm:hidden">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-3 sm:p-4 md:p-6 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">Explore learning materials from your teachers</p>
        </div>

        <div className="grid gap-6">
          <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl md:text-2xl">Learning Notes</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Read and learn from teacher notes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <NotesList readonly />
            </CardContent>
          </Card>

          <Card className="border-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Audio Lessons</CardTitle>
                  <CardDescription>Listen to audio lessons from teachers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <AudioLessonsList readonly />
            </CardContent>
          </Card>

          <Card className="border-secondary/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-secondary/5 to-accent/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Network className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Mind Maps</CardTitle>
                  <CardDescription>Explore interactive mind maps</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <MindMapsList readonly />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

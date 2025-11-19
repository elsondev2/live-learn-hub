import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from 'sonner';
import { Palette, Type, Layout, Monitor, Sun, Moon } from 'lucide-react';

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [compactMode, setCompactMode] = useState(false);

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    toast.success(`Font size changed to ${size}`);
  };

  const handleCompactModeToggle = () => {
    setCompactMode(!compactMode);
    toast.success(compactMode ? 'Compact mode disabled' : 'Compact mode enabled');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme
          </CardTitle>
          <CardDescription>Choose your preferred color theme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`p-6 border-2 rounded-lg transition-all hover:border-primary ${
                theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <Sun className="h-8 w-8 mx-auto mb-3" />
              <p className="font-medium text-center">Light</p>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-6 border-2 rounded-lg transition-all hover:border-primary ${
                theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <Moon className="h-8 w-8 mx-auto mb-3" />
              <p className="font-medium text-center">Dark</p>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`p-6 border-2 rounded-lg transition-all hover:border-primary ${
                theme === 'system' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <Monitor className="h-8 w-8 mx-auto mb-3" />
              <p className="font-medium text-center">System</p>
            </button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Current theme: <span className="font-medium text-foreground capitalize">{theme}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Font Size
          </CardTitle>
          <CardDescription>Adjust the text size across the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={fontSize === 'small' ? 'default' : 'outline'}
                onClick={() => handleFontSizeChange('small')}
                className="h-auto py-4"
              >
                <div className="text-center">
                  <p className="text-xs mb-1">Small</p>
                  <p className="text-sm">Aa</p>
                </div>
              </Button>

              <Button
                variant={fontSize === 'medium' ? 'default' : 'outline'}
                onClick={() => handleFontSizeChange('medium')}
                className="h-auto py-4"
              >
                <div className="text-center">
                  <p className="text-xs mb-1">Medium</p>
                  <p className="text-base">Aa</p>
                </div>
              </Button>

              <Button
                variant={fontSize === 'large' ? 'default' : 'outline'}
                onClick={() => handleFontSizeChange('large')}
                className="h-auto py-4"
              >
                <div className="text-center">
                  <p className="text-xs mb-1">Large</p>
                  <p className="text-lg">Aa</p>
                </div>
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className={`${
                fontSize === 'small' ? 'text-sm' : 
                fontSize === 'large' ? 'text-lg' : 
                'text-base'
              }`}>
                This is how your text will appear with the selected font size.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Layout Preferences
          </CardTitle>
          <CardDescription>Customize how content is displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <Label className="font-medium">Compact Mode</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Reduce spacing and padding for a denser layout
              </p>
            </div>
            <Button
              variant={compactMode ? 'default' : 'outline'}
              size="sm"
              onClick={handleCompactModeToggle}
            >
              {compactMode ? 'Enabled' : 'Disabled'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <Label className="font-medium">Sidebar Position</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Choose where the navigation sidebar appears
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Left</Button>
              <Button variant="outline" size="sm">Right</Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <Label className="font-medium">Animation Speed</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Control the speed of UI animations
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Slow</Button>
              <Button variant="default" size="sm">Normal</Button>
              <Button variant="outline" size="sm">Fast</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>Options to improve accessibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">High Contrast Mode</p>
              <p className="text-sm text-muted-foreground mt-1">
                Increase contrast for better visibility
              </p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Reduce Motion</p>
              <p className="text-sm text-muted-foreground mt-1">
                Minimize animations and transitions
              </p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

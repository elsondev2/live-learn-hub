import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { MINDMAP_THEMES, MindMapTheme } from '@/lib/mindmap-themes';

interface MindMapThemePickerProps {
  currentTheme: string;
  onSelectTheme: (theme: MindMapTheme) => void;
}

export function MindMapThemePicker({ currentTheme, onSelectTheme }: MindMapThemePickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Color Themes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MINDMAP_THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => onSelectTheme(theme)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="flex gap-1">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.colors.secondary }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.colors.accent }}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{theme.name}</div>
              <div className="text-xs text-muted-foreground">{theme.description}</div>
            </div>
            {currentTheme === theme.id && (
              <span className="text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

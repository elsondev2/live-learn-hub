import { NODE_ICONS, NodeIconType } from './CustomNodeEnhanced';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Smile } from 'lucide-react';

interface NodeIconPickerProps {
  value: NodeIconType;
  onChange: (icon: NodeIconType) => void;
  disabled?: boolean;
}

export function NodeIconPicker({ value, onChange, disabled }: NodeIconPickerProps) {
  const CurrentIcon = value !== 'none' ? NODE_ICONS[value] : Smile;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-10 h-8"
          disabled={disabled}
          title="Select icon"
        >
          {CurrentIcon && <CurrentIcon className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="grid grid-cols-6 gap-1">
          <button
            className={`p-2 rounded hover:bg-muted transition-colors ${
              value === 'none' ? 'bg-primary/20 ring-2 ring-primary' : ''
            }`}
            onClick={() => onChange('none')}
            title="No icon"
          >
            <span className="text-xs text-muted-foreground">✕</span>
          </button>
          {(Object.keys(NODE_ICONS) as NodeIconType[])
            .filter(key => key !== 'none')
            .map((iconKey) => {
              const Icon = NODE_ICONS[iconKey];
              if (!Icon) return null;
              return (
                <button
                  key={iconKey}
                  className={`p-2 rounded hover:bg-muted transition-colors ${
                    value === iconKey ? 'bg-primary/20 ring-2 ring-primary' : ''
                  }`}
                  onClick={() => onChange(iconKey)}
                  title={iconKey}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

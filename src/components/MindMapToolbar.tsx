import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Minus,
  Maximize2,
  Download,
  Undo,
  Redo,
  Square,
  Circle,
  Hexagon,
  Trash2,
  Copy,
  ZoomIn,
  ZoomOut,
  Maximize,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MindMapToolbarProps {
  onAddNode: () => void;
  onDeleteNode: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: (format: 'png' | 'jpg' | 'svg') => void;
  selectedNodeColor?: string;
  onColorChange: (color: string) => void;
  selectedNodeShape?: string;
  onShapeChange: (shape: string) => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function MindMapToolbar({
  onAddNode,
  onDeleteNode,
  onZoomIn,
  onZoomOut,
  onFitView,
  onUndo,
  onRedo,
  onExport,
  selectedNodeColor = '#a84370',
  onColorChange,
  selectedNodeShape = 'default',
  onShapeChange,
  canUndo,
  canRedo,
}: MindMapToolbarProps) {
  const colors = [
    { name: 'Primary', value: '#a84370' },
    { name: 'Accent', value: '#f1c4e6' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
  ];

  return (
    <div className="border-b bg-card/80 backdrop-blur-sm p-3 flex flex-wrap gap-2 items-center">
      {/* Node Actions */}
      <div className="flex gap-1">
        <Button variant="outline" size="sm" onClick={onAddNode} title="Add Node (Enter)">
          <Plus className="h-4 w-4 mr-1" />
          Add Node
        </Button>
        <Button variant="outline" size="sm" onClick={onDeleteNode} title="Delete Node (Delete)">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* History */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Zoom Controls */}
      <div className="flex gap-1">
        <Button variant="outline" size="sm" onClick={onZoomIn} title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onZoomOut} title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onFitView} title="Fit to Screen">
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Node Styling */}
      <div className="flex gap-2 items-center">
        <span className="text-sm text-muted-foreground">Color:</span>
        <div className="flex gap-1">
          {colors.map((color) => (
            <button
              key={color.value}
              className="h-6 w-6 rounded-full border-2 hover:scale-110 transition-transform"
              style={{
                backgroundColor: color.value,
                borderColor: selectedNodeColor === color.value ? '#000' : 'transparent',
              }}
              onClick={() => onColorChange(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Node Shape */}
      <div className="flex gap-2 items-center">
        <span className="text-sm text-muted-foreground">Shape:</span>
        <Select value={selectedNodeShape} onValueChange={onShapeChange}>
          <SelectTrigger className="w-32 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Rectangle</SelectItem>
            <SelectItem value="circle">Circle</SelectItem>
            <SelectItem value="rounded">Rounded</SelectItem>
            <SelectItem value="diamond">Diamond</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Export */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport('png')}
          title="Export as PNG"
        >
          <Download className="h-4 w-4 mr-1" />
          PNG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport('jpg')}
          title="Export as JPG"
        >
          JPG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport('svg')}
          title="Export as SVG"
        >
          SVG
        </Button>
      </div>
    </div>
  );
}

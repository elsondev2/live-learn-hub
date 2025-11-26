import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Trash2,
  Undo2,
  Redo2,
  Download,
  Grid3X3,
  LayoutTemplate,
  ZoomIn,
  ZoomOut,
  Maximize,
  Copy,
  Clipboard,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { NodeIconPicker } from './NodeIconPicker';
import { NodeIconType } from './CustomNodeEnhanced';

interface MindMapToolbarEnhancedProps {
  // Node actions
  onAddNode: () => void;
  onDeleteNode: () => void;
  onCopyNodes: () => void;
  onPasteNodes: () => void;
  
  // History
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Zoom & View
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  
  // Layout
  onApplyLayout: (layout: 'tree' | 'radial' | 'force') => void;
  
  // Grid
  snapToGrid: boolean;
  onToggleSnapToGrid: () => void;
  
  // Node styling
  selectedNodeColor: string;
  onColorChange: (color: string) => void;
  selectedNodeShape: string;
  onShapeChange: (shape: string) => void;
  selectedNodeIcon: NodeIconType;
  onIconChange: (icon: NodeIconType) => void;
  
  // Connection styling
  connectionStyle: string;
  onConnectionStyleChange: (style: string) => void;
  
  // Export
  onExport: (format: 'png' | 'svg' | 'json') => void;
  
  // State
  hasSelection: boolean;
  readonly?: boolean;
}

const COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Gray', value: '#6b7280' },
];

export function MindMapToolbarEnhanced({
  onAddNode,
  onDeleteNode,
  onCopyNodes,
  onPasteNodes,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
  onApplyLayout,
  snapToGrid,
  onToggleSnapToGrid,
  selectedNodeColor,
  onColorChange,
  selectedNodeShape,
  onShapeChange,
  selectedNodeIcon,
  onIconChange,
  connectionStyle,
  onConnectionStyleChange,
  onExport,
  hasSelection,
  readonly,
}: MindMapToolbarEnhancedProps) {
  if (readonly) return null;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="border-b bg-card/95 backdrop-blur-sm p-2 overflow-x-auto">
        <div className="flex flex-nowrap gap-1.5 items-center min-w-max">
          {/* Node Actions */}
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onAddNode}>
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Node (Tab)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onDeleteNode}
                  disabled={!hasSelection}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete (Del)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onCopyNodes}
                  disabled={!hasSelection}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy (Ctrl+C)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onPasteNodes}>
                  <Clipboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Paste (Ctrl+V)</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Undo/Redo */}
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onUndo}
                  disabled={!canUndo}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Node Styling */}
          <div className="flex gap-1.5 items-center">
            <span className="text-xs text-muted-foreground hidden sm:inline">Color:</span>
            <div className="flex gap-0.5">
              {COLORS.slice(0, 6).map((color) => (
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-6 w-6 rounded-full border-2 border-dashed border-muted-foreground/50 hover:border-muted-foreground flex items-center justify-center text-xs">
                    +
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="grid grid-cols-5 gap-1 p-2">
                    {COLORS.map((color) => (
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Shape */}
          <div className="flex gap-1.5 items-center">
            <span className="text-xs text-muted-foreground hidden sm:inline">Shape:</span>
            <Select value={selectedNodeShape} onValueChange={onShapeChange}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Rectangle</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="diamond">Diamond</SelectItem>
                <SelectItem value="hexagon">Hexagon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Icon */}
          <div className="flex gap-1.5 items-center">
            <span className="text-xs text-muted-foreground hidden sm:inline">Icon:</span>
            <NodeIconPicker 
              value={selectedNodeIcon} 
              onChange={onIconChange}
            />
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Connection Style */}
          <div className="flex gap-1.5 items-center">
            <span className="text-xs text-muted-foreground hidden sm:inline">Lines:</span>
            <Select value={connectionStyle} onValueChange={onConnectionStyleChange}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bezier">Curved</SelectItem>
                <SelectItem value="straight">Straight</SelectItem>
                <SelectItem value="step">Step</SelectItem>
                <SelectItem value="smoothstep">Smooth</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Layout */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <LayoutTemplate className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Layout</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onApplyLayout('tree')}>
                Tree (Hierarchical)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onApplyLayout('radial')}>
                Radial (Circular)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onApplyLayout('force')}>
                Force-Directed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Grid Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={snapToGrid ? "default" : "outline"} 
                size="sm"
                onClick={onToggleSnapToGrid}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Snap to Grid</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          {/* Zoom Controls */}
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onFitView}>
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fit View</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onExport('png')}>
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('svg')}>
                Export as SVG
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onExport('json')}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
}

import { useState } from 'react';
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
  Palette,
  Shapes,
  GitBranch,
  MoreHorizontal,
  ChevronDown,
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
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NodeIconPicker } from './NodeIconPicker';
import { NodeIconType } from './CustomNodeEnhanced';

interface MindMapToolbarEnhancedProps {
  onAddNode: () => void;
  onDeleteNode: () => void;
  onCopyNodes: () => void;
  onPasteNodes: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onApplyLayout: (layout: 'tree' | 'radial' | 'force') => void;
  snapToGrid: boolean;
  onToggleSnapToGrid: () => void;
  selectedNodeColor: string;
  onColorChange: (color: string) => void;
  selectedNodeShape: string;
  onShapeChange: (shape: string) => void;
  selectedNodeIcon: NodeIconType;
  onIconChange: (icon: NodeIconType) => void;
  connectionStyle: string;
  onConnectionStyleChange: (style: string) => void;
  onExport: (format: 'png' | 'svg' | 'json') => void;
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

const CONNECTION_STYLES = [
  { value: 'bezier', label: 'Curved', desc: 'Smooth curved lines' },
  { value: 'straight', label: 'Direct', desc: 'Straight lines' },
  { value: 'step', label: 'Sharp', desc: 'Right-angle corners' },
  { value: 'smoothstep', label: 'Smooth Step', desc: 'Rounded corners' },
];

const SHAPES = [
  { value: 'default', label: 'Rectangle' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'hexagon', label: 'Hexagon' },
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
      {/* Desktop Toolbar */}
      <div className="hidden md:block border-b bg-card/95 backdrop-blur-sm">
        <div className="flex items-center gap-1 p-2">
          {/* Group 1: Node Actions */}
          <div className="flex items-center gap-1 px-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onAddNode} className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Node</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onDeleteNode} disabled={!hasSelection} className="h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onCopyNodes} disabled={!hasSelection} className="h-8 w-8 p-0">
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onPasteNodes} className="h-8 w-8 p-0">
                  <Clipboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Paste</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Group 2: Undo/Redo */}
          <div className="flex items-center gap-1 px-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo} className="h-8 w-8 p-0">
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo} className="h-8 w-8 p-0">
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Group 3: Styling - Color Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2">
                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: selectedNodeColor }} />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Node Color</p>
                <div className="grid grid-cols-5 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      className={`w-7 h-7 rounded-full border-2 hover:scale-110 transition-transform ${
                        selectedNodeColor === color.value ? 'border-foreground ring-2 ring-offset-2 ring-primary' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => onColorChange(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Shape Selector */}
          <Select value={selectedNodeShape} onValueChange={onShapeChange}>
            <SelectTrigger className="h-8 w-[100px] text-xs">
              <Shapes className="h-3.5 w-3.5 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SHAPES.map((shape) => (
                <SelectItem key={shape.value} value={shape.value}>{shape.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Icon Picker */}
          <NodeIconPicker value={selectedNodeIcon} onChange={onIconChange} />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Group 4: Connection Style */}
          <Select value={connectionStyle} onValueChange={onConnectionStyleChange}>
            <SelectTrigger className="h-8 w-[110px] text-xs">
              <GitBranch className="h-3.5 w-3.5 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONNECTION_STYLES.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  <div>
                    <div className="font-medium">{style.label}</div>
                    <div className="text-xs text-muted-foreground">{style.desc}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Group 5: Layout & Grid */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <LayoutTemplate className="h-4 w-4" />
                <span className="text-xs">Layout</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Auto Layout</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onApplyLayout('tree')}>
                <span className="mr-2">🌳</span> Tree (Hierarchical)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onApplyLayout('radial')}>
                <span className="mr-2">🎯</span> Radial (Circular)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onApplyLayout('force')}>
                <span className="mr-2">🔮</span> Force-Directed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={snapToGrid ? "default" : "outline"} size="sm" onClick={onToggleSnapToGrid} className="h-8 w-8 p-0">
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Snap to Grid</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Group 6: Zoom */}
          <div className="flex items-center gap-1 px-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onZoomOut} className="h-8 w-8 p-0">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onZoomIn} className="h-8 w-8 p-0">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onFitView} className="h-8 w-8 p-0">
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fit View</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Group 7: Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-4 w-4" />
                <span className="text-xs">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onExport('png')}>Export as PNG</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('svg')}>Export as SVG</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onExport('json')}>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>


      {/* Mobile Toolbar - Compact & Touch-Friendly */}
      <div className="md:hidden border-b bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-2 gap-2">
          {/* Primary Actions */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={onAddNode} className="h-9 w-9 p-0">
              <Plus className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDeleteNode} disabled={!hasSelection} className="h-9 w-9 p-0">
              <Trash2 className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo} className="h-9 w-9 p-0">
              <Undo2 className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo} className="h-9 w-9 p-0">
              <Redo2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Style & More Menu */}
          <div className="flex items-center gap-1">
            {/* Quick Color */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                  <div className="w-5 h-5 rounded-full border-2" style={{ backgroundColor: selectedNodeColor }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="end">
                <div className="grid grid-cols-5 gap-3">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      className={`w-9 h-9 rounded-full border-2 active:scale-95 transition-transform ${
                        selectedNodeColor === color.value ? 'border-foreground ring-2 ring-primary' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => onColorChange(color.value)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Connection Style Quick Access */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                  <GitBranch className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Line Style</DropdownMenuLabel>
                {CONNECTION_STYLES.map((style) => (
                  <DropdownMenuItem 
                    key={style.value} 
                    onClick={() => onConnectionStyleChange(style.value)}
                    className={connectionStyle === style.value ? 'bg-accent' : ''}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{style.label}</span>
                      <span className="text-xs text-muted-foreground">{style.desc}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Options Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Edit</DropdownMenuLabel>
                <DropdownMenuItem onClick={onCopyNodes} disabled={!hasSelection}>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onPasteNodes}>
                  <Clipboard className="h-4 w-4 mr-2" /> Paste
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Node Shape</DropdownMenuLabel>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Shapes className="h-4 w-4 mr-2" />
                    {SHAPES.find(s => s.value === selectedNodeShape)?.label || 'Shape'}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {SHAPES.map((shape) => (
                      <DropdownMenuItem 
                        key={shape.value} 
                        onClick={() => onShapeChange(shape.value)}
                        className={selectedNodeShape === shape.value ? 'bg-accent' : ''}
                      >
                        {shape.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Layout</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onApplyLayout('tree')}>
                  🌳 Tree Layout
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onApplyLayout('radial')}>
                  🎯 Radial Layout
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onApplyLayout('force')}>
                  🔮 Force Layout
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>View</DropdownMenuLabel>
                <DropdownMenuItem onClick={onZoomIn}>
                  <ZoomIn className="h-4 w-4 mr-2" /> Zoom In
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onZoomOut}>
                  <ZoomOut className="h-4 w-4 mr-2" /> Zoom Out
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onFitView}>
                  <Maximize className="h-4 w-4 mr-2" /> Fit View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggleSnapToGrid}>
                  <Grid3X3 className="h-4 w-4 mr-2" /> 
                  Snap to Grid {snapToGrid && '✓'}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Export</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onExport('png')}>
                  <Download className="h-4 w-4 mr-2" /> Export PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('svg')}>
                  <Download className="h-4 w-4 mr-2" /> Export SVG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('json')}>
                  <Download className="h-4 w-4 mr-2" /> Export JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

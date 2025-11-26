import { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MINDMAP_TEMPLATES, TEMPLATE_CATEGORIES, MindMapTemplate } from '@/lib/mindmap-templates';

interface MindMapTemplatesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (nodes: Node[], edges: Edge[], title: string) => void;
}

export function MindMapTemplates({ open, onOpenChange, onSelectTemplate }: MindMapTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const filteredTemplates = selectedCategory === 'all' 
    ? MINDMAP_TEMPLATES 
    : MINDMAP_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template: MindMapTemplate) => {
    // Deep clone nodes and edges to avoid reference issues
    const clonedNodes = JSON.parse(JSON.stringify(template.nodes));
    const clonedEdges = JSON.parse(JSON.stringify(template.edges));
    
    // Generate new IDs to avoid conflicts
    const idMap = new Map<string, string>();
    const timestamp = Date.now();
    
    const newNodes = clonedNodes.map((node: Node, index: number) => {
      const newId = `node-${timestamp}-${index}`;
      idMap.set(node.id, newId);
      return { ...node, id: newId };
    });

    const newEdges = clonedEdges.map((edge: Edge, index: number) => ({
      ...edge,
      id: `edge-${timestamp}-${index}`,
      source: idMap.get(edge.source) || edge.source,
      target: idMap.get(edge.target) || edge.target,
    }));

    onSelectTemplate(newNodes, newEdges, template.name);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Start with a pre-built template or create from scratch
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-4">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                  className={`
                    relative p-4 rounded-lg border-2 text-left transition-all
                    hover:border-primary hover:shadow-md
                    ${hoveredTemplate === template.id ? 'border-primary bg-primary/5' : 'border-border'}
                  `}
                >
                  <div className="text-3xl mb-2">{template.thumbnail}</div>
                  <h3 className="font-medium text-sm">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{template.nodes.length} nodes</span>
                    <span>•</span>
                    <span>{template.edges.length} connections</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

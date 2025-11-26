import { useState, useEffect, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search, X, MapPin } from 'lucide-react';

interface MindMapSearchProps {
  nodes: Node[];
  onFocusNode: (nodeId: string) => void;
  onHighlightNodes: (nodeIds: string[]) => void;
}

export function MindMapSearch({ nodes, onFocusNode, onHighlightNodes }: MindMapSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Node[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      onHighlightNodes([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const matched = nodes.filter((node) => {
      const label = (node.data?.label as string || '').toLowerCase();
      const notes = (node.data?.notes as string || '').toLowerCase();
      return label.includes(searchTerm) || notes.includes(searchTerm);
    });

    setResults(matched);
    onHighlightNodes(matched.map(n => n.id));
  }, [query, nodes, onHighlightNodes]);

  const handleSelectNode = useCallback((nodeId: string) => {
    onFocusNode(nodeId);
    setOpen(false);
  }, [onFocusNode]);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    onHighlightNodes([]);
  }, [onHighlightNodes]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 pr-9"
              autoFocus
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-64">
          {results.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-muted-foreground px-2 py-1">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
              {results.map((node) => (
                <button
                  key={node.id}
                  onClick={() => handleSelectNode(node.id)}
                  className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted text-left"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: (node.data?.color as string) || '#3b82f6' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {node.data?.label as string || 'Untitled'}
                    </div>
                    {node.data?.notes && (
                      <div className="text-xs text-muted-foreground truncate">
                        {node.data.notes as string}
                      </div>
                    )}
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No nodes found matching "{query}"
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Type to search nodes by label or notes
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

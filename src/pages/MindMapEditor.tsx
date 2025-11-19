import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlow, MiniMap, Controls, Background, Node, Edge, addEdge, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import * as services from '@/lib/services';

export default function MindMapEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [title, setTitle] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id && id !== 'new' && user) {
      fetchMindMap();
    } else {
      setNodes([
        { id: '1', position: { x: 250, y: 100 }, data: { label: 'Main Topic' } },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchMindMap = async () => {
    if (!user || !id) return;
    
    try {
      const data = await services.getMindMap(id, user._id.toString());
      if (data) {
        setTitle(data.title);
        const nodesData = data.nodes as unknown;
        const edgesData = data.edges as unknown;
        setNodes(Array.isArray(nodesData) ? nodesData : []);
        setEdges(Array.isArray(edgesData) ? edgesData : []);
      }
    } catch (error) {
      console.error('Error fetching mind map:', error);
      toast.error('Failed to load mind map');
    }
  };

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const handleSave = async () => {
    if (!user) return;
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      if (id === 'new') {
        await services.createMindMap(user._id.toString(), title, nodes, edges);
      } else {
        await services.updateMindMap(id!, user._id.toString(), title, nodes, edges);
      }
      toast.success('Mind map saved!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const readonly = userRole === 'STUDENT';

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="border-b bg-card p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Mind map title..."
            className="mx-4 max-w-md"
            disabled={readonly}
          />
          {!readonly && (
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            if (!readonly) {
              setNodes((nds) => {
                // Apply changes to nodes
                return nds.map((node) => {
                  const change = changes.find((c) => 'id' in c && c.id === node.id);
                  if (change && 'type' in change && change.type === 'position' && 'position' in change && change.position) {
                    return { ...node, position: change.position };
                  }
                  return node;
                });
              });
            }
          }}
          onEdgesChange={(changes) => {
            if (!readonly) {
              setEdges((eds) => {
                // Filter out removed edges
                return eds.filter((edge) => {
                  const removeChange = changes.find((c) => 'id' in c && c.id === edge.id && 'type' in c && c.type === 'remove');
                  return !removeChange;
                });
              });
            }
          }}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

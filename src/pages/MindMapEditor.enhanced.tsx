import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MindMapToolbar } from '@/components/MindMapToolbar';
import { CustomNode } from '@/components/CustomNode';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import * as services from '@/lib/services';
import { toPng, toJpeg, toSvg } from 'html-to-image';

const nodeTypes = {
  custom: CustomNode,
};

export default function MindMapEditorEnhanced() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [title, setTitle] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [saving, setSaving] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const readonly = userRole === 'STUDENT';

  useEffect(() => {
    if (id && id !== 'new' && user) {
      fetchMindMap();
    } else {
      // Initialize with a root node
      const initialNode: Node = {
        id: '1',
        type: 'custom',
        position: { x: 400, y: 200 },
        data: {
          label: 'Main Topic',
          color: '#a84370',
          textColor: '#ffffff',
          shape: 'rounded',
        },
      };
      setNodes([initialNode]);
      addToHistory([initialNode], []);
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
        const loadedNodes = Array.isArray(nodesData) ? nodesData : [];
        const loadedEdges = Array.isArray(edgesData) ? edgesData : [];
        setNodes(loadedNodes);
        setEdges(loadedEdges);
        addToHistory(loadedNodes, loadedEdges);
      }
    } catch (error) {
      console.error('Error fetching mind map:', error);
      toast.error('Failed to load mind map');
    }
  };

  const addToHistory = (newNodes: Node[], newEdges: Edge[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: newNodes, edges: newEdges });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex].nodes);
      setEdges(history[newIndex].edges);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex].nodes);
      setEdges(history[newIndex].edges);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(
        {
          ...params,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#a84370', strokeWidth: 2 },
        },
        edges
      );
      setEdges(newEdges);
      addToHistory(nodes, newEdges);
    },
    [edges, nodes, setEdges]
  );

  const addNode = () => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type: 'custom',
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 400 + 100,
      },
      data: {
        label: 'New Node',
        color: selectedNode?.data.color || '#a84370',
        textColor: '#ffffff',
        shape: selectedNode?.data.shape || 'default',
      },
    };

    const newNodes = [...nodes, newNode];
    setNodes(newNodes);

    // If a node is selected, connect to it
    if (selectedNode) {
      const newEdge: Edge = {
        id: `e${selectedNode.id}-${newNode.id}`,
        source: selectedNode.id,
        target: newNode.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#a84370', strokeWidth: 2 },
      };
      const newEdges = [...edges, newEdge];
      setEdges(newEdges);
      addToHistory(newNodes, newEdges);
    } else {
      addToHistory(newNodes, edges);
    }
  };

  const deleteNode = () => {
    if (!selectedNode) {
      toast.error('Please select a node first');
      return;
    }

    const newNodes = nodes.filter((n) => n.id !== selectedNode.id);
    const newEdges = edges.filter(
      (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
    );
    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNode(null);
    addToHistory(newNodes, newEdges);
  };

  const changeNodeColor = useCallback((color: string) => {
    if (!selectedNode) return;

    const newNodes = nodes.map((node) =>
      node.id === selectedNode.id
        ? { ...node, data: { ...node.data, color } }
        : node
    );
    setNodes(newNodes);
    setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, color } });
    addToHistory(newNodes, edges);
  }, [selectedNode, nodes, edges, setNodes]);

  const changeNodeShape = useCallback((shape: string) => {
    if (!selectedNode) return;

    const newNodes = nodes.map((node) =>
      node.id === selectedNode.id
        ? { ...node, data: { ...node.data, shape } }
        : node
    );
    setNodes(newNodes);
    setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, shape } });
    addToHistory(newNodes, edges);
  }, [selectedNode, nodes, setNodes, addToHistory, edges]);

  const exportMap = async (format: 'png' | 'jpg' | 'svg') => {
    if (!reactFlowWrapper.current) return;

    try {
      let dataUrl: string;
      if (format === 'png') {
        dataUrl = await toPng(reactFlowWrapper.current);
      } else if (format === 'jpg') {
        dataUrl = await toJpeg(reactFlowWrapper.current);
      } else {
        dataUrl = await toSvg(reactFlowWrapper.current);
      }

      const link = document.createElement('a');
      link.download = `${title || 'mindmap'}.${format}`;
      link.href = dataUrl;
      link.click();
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export');
    }
  };

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
        toast.success('Mind map created!');
      } else {
        await services.updateMindMap(id!, user._id.toString(), title, nodes, edges);
        toast.success('Mind map saved!');
      }

      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="border-b bg-card/80 backdrop-blur-sm p-4">
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

      {!readonly && (
        <MindMapToolbar
          onAddNode={addNode}
          onDeleteNode={deleteNode}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onFitView={() => {}}
          onUndo={undo}
          onRedo={redo}
          onExport={exportMap}
          selectedNodeColor={selectedNode?.data.color}
          onColorChange={changeNodeColor}
          selectedNodeShape={selectedNode?.data.shape}
          onShapeChange={changeNodeShape}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />
      )}

      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={readonly ? undefined : onNodesChange}
          onEdgesChange={readonly ? undefined : onEdgesChange}
          onConnect={readonly ? undefined : onConnect}
          onNodeClick={(_, node) => setSelectedNode(node)}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Panel position="top-right" className="bg-card/80 backdrop-blur-sm p-2 rounded-lg text-sm">
            {selectedNode ? `Selected: ${(selectedNode.data.label as string) || 'Node'}` : 'No node selected'}
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

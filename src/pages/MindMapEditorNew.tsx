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
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
  Panel,
  MarkerType,
  NodeChange,
  SelectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MindMapToolbarEnhanced } from '@/components/MindMapToolbarEnhanced';
import { CustomNodeEnhanced, NodeIconType } from '@/components/CustomNodeEnhanced';
import { MindMapTemplates } from '@/components/MindMapTemplates';
import { MindMapThemePicker } from '@/components/MindMapThemePicker';
import { MindMapSearch } from '@/components/MindMapSearch';
import { ArrowLeft, Save, Loader2, LayoutGrid, Upload } from 'lucide-react';
import { toast } from 'sonner';
import * as services from '@/lib/services';
import { treeLayout, radialLayout, forceLayout, snapToGrid } from '@/lib/mindmap-layouts';
import { MindMapTheme, applyThemeToNodes, applyThemeToEdges, getThemeById } from '@/lib/mindmap-themes';
import { toPng, toSvg } from 'html-to-image';

const nodeTypes = { custom: CustomNodeEnhanced };

interface HistoryState { nodes: Node[]; edges: Edge[]; }
const MAX_HISTORY = 50;


function MindMapEditorInner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { fitView, zoomIn, zoomOut, setCenter } = useReactFlow();

  // Core state
  const [title, setTitle] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapOwnerId, setMapOwnerId] = useState<string | null>(null);

  // Selection state
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

  // Styling state
  const [nodeColor, setNodeColor] = useState('#3b82f6');
  const [nodeShape, setNodeShape] = useState('default');
  const [nodeIcon, setNodeIcon] = useState<NodeIconType>('none');
  const [connectionStyle, setConnectionStyle] = useState('bezier');
  const [enableSnapToGrid, setEnableSnapToGrid] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedo = useRef(false);

  // Clipboard for copy/paste
  const [clipboard, setClipboard] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);

  // Phase 3: Templates & Search
  const [showTemplates, setShowTemplates] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);

  // Permissions
  const isOwner = user && (id === 'new' || mapOwnerId === user._id.toString());
  const isTeacher = userRole === 'TEACHER';
  const canEdit = (id === 'new' || isOwner) && isTeacher;
  const readonly = !canEdit;

  // Show template picker for new maps
  useEffect(() => {
    if (id === 'new' && !loading) {
      setShowTemplates(true);
    }
  }, [id, loading]);


  // Initialize or fetch mind map
  useEffect(() => {
    if (id && id !== 'new' && user) {
      fetchMindMap();
    } else if (id === 'new') {
      const initialNode: Node = {
        id: '1',
        type: 'custom',
        position: { x: 400, y: 200 },
        data: { label: 'Main Topic', color: '#3b82f6', shape: 'rounded', icon: 'lightbulb' },
      };
      setNodes([initialNode]);
      addToHistory([initialNode], []);
      setLoading(false);
    }
  }, [id, user]);

  // Listen for inline label changes
  useEffect(() => {
    const handleLabelChange = (e: CustomEvent<{ nodeId: string; newLabel: string }>) => {
      const { nodeId, newLabel } = e.detail;
      setNodes((nds) => nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
      ));
    };
    window.addEventListener('node-label-change', handleLabelChange as EventListener);
    return () => window.removeEventListener('node-label-change', handleLabelChange as EventListener);
  }, [setNodes]);

  // Keyboard shortcuts
  useEffect(() => {
    if (readonly) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); handleDeleteSelected(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'c') { e.preventDefault(); handleCopy(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'v') { e.preventDefault(); handlePaste(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); handleRedo(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'a') { e.preventDefault(); setNodes((nds) => nds.map((n) => ({ ...n, selected: true }))); }
      else if (e.key === 'Escape') { setNodes((nds) => nds.map((n) => ({ ...n, selected: false }))); setEdges((eds) => eds.map((e) => ({ ...e, selected: false }))); }
      else if (e.key === 'Tab' && selectedNodes.length === 1) { e.preventDefault(); handleAddChildNode(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); /* Search handled by component */ }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readonly, selectedNodes, clipboard, history, historyIndex, nodes, edges]);


  const fetchMindMap = async () => {
    if (!user || !id) return;
    setLoading(true);
    try {
      const data = await services.getMindMap(id, user._id.toString());
      if (data) {
        setTitle(data.title);
        setMapOwnerId(data.user_id);
        const nodesData = Array.isArray(data.nodes) ? data.nodes : [];
        const edgesData = Array.isArray(data.edges) ? data.edges : [];
        setNodes(nodesData);
        setEdges(edgesData);
        addToHistory(nodesData, edgesData);
      }
    } catch (error) {
      console.error('Error fetching mind map:', error);
      toast.error('Failed to load mind map');
    } finally {
      setLoading(false);
    }
  };

  // History management
  const addToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    if (isUndoRedo.current) { isUndoRedo.current = false; return; }
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ nodes: newNodes, edges: newEdges });
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedo.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex].nodes);
      setEdges(history[newIndex].edges);
    }
  }, [historyIndex, history, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedo.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex].nodes);
      setEdges(history[newIndex].edges);
    }
  }, [historyIndex, history, setNodes, setEdges]);


  // Node operations
  const handleAddNode = useCallback(() => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: 400 + Math.random() * 200 - 100, y: 300 + Math.random() * 200 - 100 },
      data: { label: 'New Node', color: nodeColor, shape: nodeShape, icon: nodeIcon },
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    addToHistory(newNodes, edges);
    toast.success('Node added');
  }, [nodes, edges, nodeColor, nodeShape, nodeIcon, setNodes, addToHistory]);

  const handleAddChildNode = useCallback(() => {
    if (selectedNodes.length !== 1) return;
    const parentNode = nodes.find((n) => n.id === selectedNodes[0]);
    if (!parentNode) return;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: parentNode.position.x + 200, y: parentNode.position.y + 50 },
      data: { label: 'New Node', color: nodeColor, shape: nodeShape, icon: nodeIcon },
    };
    const newEdge: Edge = {
      id: `edge-${parentNode.id}-${newNode.id}`,
      source: parentNode.id,
      target: newNode.id,
      type: connectionStyle,
      animated: true,
      style: { stroke: nodeColor, strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: nodeColor },
    };
    const newNodes = [...nodes, newNode];
    const newEdges = [...edges, newEdge];
    setNodes(newNodes);
    setEdges(newEdges);
    addToHistory(newNodes, newEdges);
    toast.success('Child node added');
  }, [selectedNodes, nodes, edges, nodeColor, nodeShape, nodeIcon, connectionStyle, setNodes, setEdges, addToHistory]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedNodes.length === 0 && selectedEdges.length === 0) {
      toast.error('Select nodes or edges to delete');
      return;
    }
    const newNodes = nodes.filter((n) => !selectedNodes.includes(n.id));
    const newEdges = edges.filter((e) => !selectedEdges.includes(e.id) && !selectedNodes.includes(e.source) && !selectedNodes.includes(e.target));
    setNodes(newNodes);
    setEdges(newEdges);
    addToHistory(newNodes, newEdges);
    toast.success('Deleted');
  }, [selectedNodes, selectedEdges, nodes, edges, setNodes, setEdges, addToHistory]);


  // Copy/Paste
  const handleCopy = useCallback(() => {
    if (selectedNodes.length === 0) { toast.error('Select nodes to copy'); return; }
    const nodesToCopy = nodes.filter((n) => selectedNodes.includes(n.id));
    const edgesToCopy = edges.filter((e) => selectedNodes.includes(e.source) && selectedNodes.includes(e.target));
    setClipboard({ nodes: nodesToCopy, edges: edgesToCopy });
    toast.success(`Copied ${nodesToCopy.length} node(s)`);
  }, [selectedNodes, nodes, edges]);

  const handlePaste = useCallback(() => {
    if (!clipboard || clipboard.nodes.length === 0) { toast.error('Nothing to paste'); return; }
    const offset = 50;
    const idMap = new Map<string, string>();
    const newNodes = clipboard.nodes.map((node) => {
      const newId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      idMap.set(node.id, newId);
      return { ...node, id: newId, position: { x: node.position.x + offset, y: node.position.y + offset }, selected: true };
    });
    const newEdges = clipboard.edges.map((edge) => ({
      ...edge,
      id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source: idMap.get(edge.source) || edge.source,
      target: idMap.get(edge.target) || edge.target,
    }));
    const updatedNodes = nodes.map((n) => ({ ...n, selected: false }));
    const allNodes = [...updatedNodes, ...newNodes];
    const allEdges = [...edges, ...newEdges];
    setNodes(allNodes);
    setEdges(allEdges);
    addToHistory(allNodes, allEdges);
    toast.success(`Pasted ${newNodes.length} node(s)`);
  }, [clipboard, nodes, edges, setNodes, setEdges, addToHistory]);

  // Styling changes
  const handleColorChange = useCallback((color: string) => {
    setNodeColor(color);
    if (selectedNodes.length > 0) {
      const newNodes = nodes.map((node) => selectedNodes.includes(node.id) ? { ...node, data: { ...node.data, color } } : node);
      setNodes(newNodes);
      addToHistory(newNodes, edges);
    }
  }, [selectedNodes, nodes, edges, setNodes, addToHistory]);

  const handleShapeChange = useCallback((shape: string) => {
    setNodeShape(shape);
    if (selectedNodes.length > 0) {
      const newNodes = nodes.map((node) => selectedNodes.includes(node.id) ? { ...node, data: { ...node.data, shape } } : node);
      setNodes(newNodes);
      addToHistory(newNodes, edges);
    }
  }, [selectedNodes, nodes, edges, setNodes, addToHistory]);

  const handleIconChange = useCallback((icon: NodeIconType) => {
    setNodeIcon(icon);
    if (selectedNodes.length > 0) {
      const newNodes = nodes.map((node) => selectedNodes.includes(node.id) ? { ...node, data: { ...node.data, icon } } : node);
      setNodes(newNodes);
      addToHistory(newNodes, edges);
    }
  }, [selectedNodes, nodes, edges, setNodes, addToHistory]);

  const handleConnectionStyleChange = useCallback((style: string) => {
    setConnectionStyle(style);
    const newEdges = edges.map((edge) => ({ ...edge, type: style }));
    setEdges(newEdges);
    addToHistory(nodes, newEdges);
  }, [edges, nodes, setEdges, addToHistory]);


  // Phase 3: Theme application
  const handleApplyTheme = useCallback((theme: MindMapTheme) => {
    setCurrentTheme(theme.id);
    const themedNodes = applyThemeToNodes(nodes, theme);
    const themedEdges = applyThemeToEdges(edges, theme);
    setNodes(themedNodes);
    setEdges(themedEdges);
    setNodeColor(theme.nodeDefaults.color);
    setNodeShape(theme.nodeDefaults.shape);
    setConnectionStyle(theme.edgeDefaults.type);
    addToHistory(themedNodes, themedEdges);
    toast.success(`Applied ${theme.name} theme`);
  }, [nodes, edges, setNodes, setEdges, addToHistory]);

  // Phase 3: Template selection
  const handleSelectTemplate = useCallback((templateNodes: Node[], templateEdges: Edge[], templateTitle: string) => {
    setNodes(templateNodes);
    setEdges(templateEdges);
    if (!title) setTitle(templateTitle);
    addToHistory(templateNodes, templateEdges);
    setTimeout(() => fitView({ padding: 0.2 }), 50);
    toast.success('Template applied');
  }, [setNodes, setEdges, title, addToHistory, fitView]);

  // Phase 3: Import JSON
  const handleImportJSON = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.nodes && Array.isArray(data.nodes)) {
          setNodes(data.nodes);
          setEdges(data.edges || []);
          if (data.title) setTitle(data.title);
          addToHistory(data.nodes, data.edges || []);
          setTimeout(() => fitView({ padding: 0.2 }), 50);
          toast.success('Mind map imported');
        } else {
          toast.error('Invalid mind map file');
        }
      } catch {
        toast.error('Failed to parse file');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [setNodes, setEdges, addToHistory, fitView]);

  // Phase 3: Search - Focus on node
  const handleFocusNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setCenter(node.position.x + 60, node.position.y + 30, { zoom: 1.5, duration: 500 });
      setNodes(nds => nds.map(n => ({ ...n, selected: n.id === nodeId })));
    }
  }, [nodes, setCenter, setNodes]);

  // Layout
  const handleApplyLayout = useCallback((layout: 'tree' | 'radial' | 'force') => {
    let newNodes: Node[];
    switch (layout) {
      case 'tree': newNodes = treeLayout(nodes, edges, { direction: 'TB', nodeSpacing: 180, levelSpacing: 120 }); break;
      case 'radial': newNodes = radialLayout(nodes, edges); break;
      case 'force': newNodes = forceLayout(nodes, edges, 100); break;
      default: return;
    }
    setNodes(newNodes);
    addToHistory(newNodes, edges);
    setTimeout(() => fitView({ padding: 0.2 }), 50);
    toast.success(`Applied ${layout} layout`);
  }, [nodes, edges, setNodes, addToHistory, fitView]);


  // Connection handler
  const onConnect = useCallback((params: Connection) => {
    const newEdge: Edge = {
      ...params,
      id: `edge-${params.source}-${params.target}-${Date.now()}`,
      type: connectionStyle,
      animated: true,
      style: { stroke: nodeColor, strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: nodeColor },
    } as Edge;
    const newEdges = addEdge(newEdge, edges);
    setEdges(newEdges);
    addToHistory(nodes, newEdges);
  }, [connectionStyle, nodeColor, edges, nodes, setEdges, addToHistory]);

  // Selection change handler
  const onSelectionChange = useCallback(({ nodes: selectedN, edges: selectedE }: { nodes: Node[]; edges: Edge[] }) => {
    setSelectedNodes(selectedN.map((n) => n.id));
    setSelectedEdges(selectedE.map((e) => e.id));
    if (selectedN.length > 0) {
      const firstNode = selectedN[0];
      if (firstNode.data.color) setNodeColor(firstNode.data.color as string);
      if (firstNode.data.shape) setNodeShape(firstNode.data.shape as string);
      if (firstNode.data.icon) setNodeIcon(firstNode.data.icon as NodeIconType);
    }
  }, []);

  // Node change handler with snap to grid
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    if (readonly) return;
    if (enableSnapToGrid) {
      changes = changes.map((change) => {
        if (change.type === 'position' && change.position) {
          return { ...change, position: snapToGrid(change.position, 20) };
        }
        return change;
      });
    }
    onNodesChange(changes);
    const hasDragEnd = changes.some((c) => c.type === 'position' && !c.dragging);
    if (hasDragEnd) addToHistory(nodes, edges);
  }, [readonly, enableSnapToGrid, onNodesChange, nodes, edges, addToHistory]);

  // Export
  const handleExport = useCallback(async (format: 'png' | 'svg' | 'json') => {
    if (format === 'json') {
      const data = JSON.stringify({ title, nodes, edges }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title || 'mindmap'}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Exported as JSON');
      return;
    }
    if (!reactFlowWrapper.current) return;
    try {
      const flowElement = reactFlowWrapper.current.querySelector('.react-flow') as HTMLElement;
      if (!flowElement) return;
      let dataUrl: string;
      if (format === 'png') {
        dataUrl = await toPng(flowElement, { backgroundColor: '#ffffff' });
      } else {
        dataUrl = await toSvg(flowElement, { backgroundColor: '#ffffff' });
      }
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${title || 'mindmap'}.${format}`;
      link.click();
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch { toast.error('Export failed'); }
  }, [title, nodes, edges]);


  // Save
  const handleSave = async () => {
    if (!user) return;
    if (!title.trim()) { toast.error('Please enter a title'); return; }
    if (!canEdit) { toast.error('You do not have permission to save'); return; }
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
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="border-b bg-card p-3 flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Mind map title..."
            className="flex-1 min-w-[150px] max-w-md font-semibold"
            disabled={readonly}
          />

          {!readonly && (
            <>
              <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>
                <LayoutGrid className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Templates</span>
              </Button>

              <MindMapThemePicker currentTheme={currentTheme} onSelectTheme={handleApplyTheme} />

              <MindMapSearch nodes={nodes} onFocusNode={handleFocusNode} onHighlightNodes={setHighlightedNodes} />

              <label className="cursor-pointer">
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                <Button variant="outline" size="sm" asChild>
                  <span><Upload className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Import</span></span>
                </Button>
              </label>
            </>
          )}

          {readonly && (
            <div className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md">View Only</div>
          )}

          {canEdit && (
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
              {saving ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>


        {/* Toolbar */}
        <MindMapToolbarEnhanced
          onAddNode={handleAddNode}
          onDeleteNode={handleDeleteSelected}
          onCopyNodes={handleCopy}
          onPasteNodes={handlePaste}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onZoomIn={() => zoomIn()}
          onZoomOut={() => zoomOut()}
          onFitView={() => fitView({ padding: 0.2 })}
          onApplyLayout={handleApplyLayout}
          snapToGrid={enableSnapToGrid}
          onToggleSnapToGrid={() => setEnableSnapToGrid(!enableSnapToGrid)}
          selectedNodeColor={nodeColor}
          onColorChange={handleColorChange}
          selectedNodeShape={nodeShape}
          onShapeChange={handleShapeChange}
          selectedNodeIcon={nodeIcon}
          onIconChange={handleIconChange}
          connectionStyle={connectionStyle}
          onConnectionStyleChange={handleConnectionStyleChange}
          onExport={handleExport}
          hasSelection={selectedNodes.length > 0}
          readonly={readonly}
        />

        {/* Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={readonly ? undefined : onEdgesChange}
            onConnect={readonly ? undefined : onConnect}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1}
            maxZoom={4}
            selectionMode={SelectionMode.Partial}
            selectNodesOnDrag={false}
            panOnScroll
            panOnDrag={[1, 2]}
            selectionOnDrag
            nodesDraggable={!readonly}
            nodesConnectable={!readonly}
            elementsSelectable={true}
            defaultEdgeOptions={{
              type: connectionStyle,
              animated: true,
              style: { stroke: nodeColor, strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: nodeColor },
            }}
          >
            <Controls showInteractive={!readonly} />
            <MiniMap
              nodeColor={(node) => (node.data?.color as string) || '#3b82f6'}
              maskColor="rgba(0, 0, 0, 0.1)"
              className="bg-card/80 backdrop-blur-sm rounded-lg"
            />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Panel position="bottom-left" className="text-xs text-muted-foreground bg-card/80 px-2 py-1 rounded">
              {nodes.length} nodes • {edges.length} connections
              {selectedNodes.length > 0 && ` • ${selectedNodes.length} selected`}
            </Panel>
          </ReactFlow>
        </div>

        {/* Templates Dialog */}
        <MindMapTemplates open={showTemplates} onOpenChange={setShowTemplates} onSelectTemplate={handleSelectTemplate} />
      </div>
    </DashboardLayout>
  );
}

export default function MindMapEditorNew() {
  return (
    <ReactFlowProvider>
      <MindMapEditorInner />
    </ReactFlowProvider>
  );
}

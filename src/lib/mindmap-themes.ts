import { Node, Edge } from '@xyflow/react';

export interface MindMapTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  nodeDefaults: {
    color: string;
    textColor: string;
    shape: string;
  };
  edgeDefaults: {
    color: string;
    type: string;
    animated: boolean;
  };
}

export const MINDMAP_THEMES: MindMapTheme[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean blue theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#ffffff',
    },
    nodeDefaults: {
      color: '#3b82f6',
      textColor: '#ffffff',
      shape: 'rounded',
    },
    edgeDefaults: {
      color: '#3b82f6',
      type: 'bezier',
      animated: true,
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Dark theme with vibrant accents',
    colors: {
      primary: '#6366f1',
      secondary: '#22d3ee',
      accent: '#f472b6',
      background: '#1e1e2e',
      text: '#ffffff',
    },
    nodeDefaults: {
      color: '#6366f1',
      textColor: '#ffffff',
      shape: 'rounded',
    },
    edgeDefaults: {
      color: '#6366f1',
      type: 'bezier',
      animated: true,
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Earthy greens and browns',
    colors: {
      primary: '#22c55e',
      secondary: '#84cc16',
      accent: '#a3e635',
      background: '#f0fdf4',
      text: '#ffffff',
    },
    nodeDefaults: {
      color: '#22c55e',
      textColor: '#ffffff',
      shape: 'rounded',
    },
    edgeDefaults: {
      color: '#22c55e',
      type: 'smoothstep',
      animated: false,
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges and reds',
    colors: {
      primary: '#f97316',
      secondary: '#ef4444',
      accent: '#fbbf24',
      background: '#fffbeb',
      text: '#ffffff',
    },
    nodeDefaults: {
      color: '#f97316',
      textColor: '#ffffff',
      shape: 'default',
    },
    edgeDefaults: {
      color: '#f97316',
      type: 'bezier',
      animated: true,
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blues and teals',
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#14b8a6',
      background: '#f0f9ff',
      text: '#ffffff',
    },
    nodeDefaults: {
      color: '#0ea5e9',
      textColor: '#ffffff',
      shape: 'rounded',
    },
    edgeDefaults: {
      color: '#0ea5e9',
      type: 'smoothstep',
      animated: true,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean grayscale design',
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#9ca3af',
      background: '#ffffff',
      text: '#ffffff',
    },
    nodeDefaults: {
      color: '#374151',
      textColor: '#ffffff',
      shape: 'default',
    },
    edgeDefaults: {
      color: '#374151',
      type: 'straight',
      animated: false,
    },
  },
  {
    id: 'candy',
    name: 'Candy',
    description: 'Playful pinks and purples',
    colors: {
      primary: '#ec4899',
      secondary: '#a855f7',
      accent: '#f472b6',
      background: '#fdf2f8',
      text: '#ffffff',
    },
    nodeDefaults: {
      color: '#ec4899',
      textColor: '#ffffff',
      shape: 'rounded',
    },
    edgeDefaults: {
      color: '#ec4899',
      type: 'bezier',
      animated: true,
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate blues and grays',
    colors: {
      primary: '#1e40af',
      secondary: '#3730a3',
      accent: '#1e3a8a',
      background: '#f8fafc',
      text: '#ffffff',
    },
    nodeDefaults: {
      color: '#1e40af',
      textColor: '#ffffff',
      shape: 'default',
    },
    edgeDefaults: {
      color: '#1e40af',
      type: 'smoothstep',
      animated: false,
    },
  },
];

export function getThemeById(id: string): MindMapTheme | undefined {
  return MINDMAP_THEMES.find(t => t.id === id);
}

export function applyThemeToNodes(nodes: Node[], theme: MindMapTheme): Node[] {
  const colors = [theme.colors.primary, theme.colors.secondary, theme.colors.accent];
  
  return nodes.map((node, index) => ({
    ...node,
    data: {
      ...node.data,
      color: colors[index % colors.length],
      textColor: theme.colors.text,
      shape: theme.nodeDefaults.shape,
    },
  }));
}

export function applyThemeToEdges(edges: Edge[], theme: MindMapTheme): Edge[] {
  return edges.map(edge => ({
    ...edge,
    type: theme.edgeDefaults.type,
    animated: theme.edgeDefaults.animated,
    style: { ...edge.style, stroke: theme.edgeDefaults.color, strokeWidth: 2 },
    markerEnd: edge.markerEnd ? { ...edge.markerEnd, color: theme.edgeDefaults.color } : undefined,
  }));
}

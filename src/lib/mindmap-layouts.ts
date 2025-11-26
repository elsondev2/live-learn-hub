import { Node, Edge } from '@xyflow/react';

interface LayoutOptions {
  direction?: 'TB' | 'BT' | 'LR' | 'RL';
  nodeSpacing?: number;
  levelSpacing?: number;
}

// Simple tree layout algorithm
export function treeLayout(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {}
): Node[] {
  const { direction = 'TB', nodeSpacing = 150, levelSpacing = 100 } = options;
  
  if (nodes.length === 0) return nodes;

  // Build adjacency map
  const children = new Map<string, string[]>();
  const parents = new Map<string, string>();
  
  edges.forEach(edge => {
    if (!children.has(edge.source)) {
      children.set(edge.source, []);
    }
    children.get(edge.source)!.push(edge.target);
    parents.set(edge.target, edge.source);
  });

  // Find root nodes (nodes with no parents)
  const roots = nodes.filter(n => !parents.has(n.id));
  if (roots.length === 0 && nodes.length > 0) {
    roots.push(nodes[0]);
  }

  // Calculate subtree widths
  const subtreeWidths = new Map<string, number>();
  
  function calcWidth(nodeId: string): number {
    const nodeChildren = children.get(nodeId) || [];
    if (nodeChildren.length === 0) {
      subtreeWidths.set(nodeId, 1);
      return 1;
    }
    const width = nodeChildren.reduce((sum, childId) => sum + calcWidth(childId), 0);
    subtreeWidths.set(nodeId, width);
    return width;
  }

  roots.forEach(root => calcWidth(root.id));

  // Position nodes
  const positioned = new Map<string, { x: number; y: number }>();
  
  function positionNode(nodeId: string, x: number, y: number, level: number) {
    const isHorizontal = direction === 'LR' || direction === 'RL';
    const isReversed = direction === 'BT' || direction === 'RL';
    
    const posX = isHorizontal ? (isReversed ? -level * levelSpacing : level * levelSpacing) : x;
    const posY = isHorizontal ? x : (isReversed ? -level * levelSpacing : level * levelSpacing);
    
    positioned.set(nodeId, { x: posX, y: posY });
    
    const nodeChildren = children.get(nodeId) || [];
    if (nodeChildren.length === 0) return;
    
    let currentX = x - ((subtreeWidths.get(nodeId) || 1) - 1) * nodeSpacing / 2;
    
    nodeChildren.forEach(childId => {
      const childWidth = subtreeWidths.get(childId) || 1;
      const childX = currentX + (childWidth - 1) * nodeSpacing / 2;
      positionNode(childId, childX, y, level + 1);
      currentX += childWidth * nodeSpacing;
    });
  }

  let startX = 0;
  roots.forEach(root => {
    const rootWidth = subtreeWidths.get(root.id) || 1;
    positionNode(root.id, startX + (rootWidth - 1) * nodeSpacing / 2, 0, 0);
    startX += rootWidth * nodeSpacing + nodeSpacing;
  });

  // Apply positions to nodes
  return nodes.map(node => {
    const pos = positioned.get(node.id);
    if (pos) {
      return { ...node, position: { x: pos.x + 400, y: pos.y + 200 } };
    }
    return node;
  });
}

// Radial layout algorithm
export function radialLayout(nodes: Node[], edges: Edge[]): Node[] {
  if (nodes.length === 0) return nodes;
  
  const centerX = 400;
  const centerY = 300;
  const baseRadius = 150;
  
  // Build adjacency map
  const children = new Map<string, string[]>();
  const parents = new Map<string, string>();
  
  edges.forEach(edge => {
    if (!children.has(edge.source)) {
      children.set(edge.source, []);
    }
    children.get(edge.source)!.push(edge.target);
    parents.set(edge.target, edge.source);
  });

  // Find root
  const roots = nodes.filter(n => !parents.has(n.id));
  const root = roots[0] || nodes[0];
  
  const positioned = new Map<string, { x: number; y: number }>();
  positioned.set(root.id, { x: centerX, y: centerY });

  // BFS to position nodes in concentric circles
  const levels = new Map<string, number>();
  levels.set(root.id, 0);
  
  const queue = [root.id];
  const visited = new Set<string>([root.id]);
  
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const nodeChildren = children.get(nodeId) || [];
    const level = levels.get(nodeId)! + 1;
    
    nodeChildren.forEach(childId => {
      if (!visited.has(childId)) {
        visited.add(childId);
        levels.set(childId, level);
        queue.push(childId);
      }
    });
  }

  // Group nodes by level
  const levelGroups = new Map<number, string[]>();
  levels.forEach((level, nodeId) => {
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level)!.push(nodeId);
  });

  // Position each level in a circle
  levelGroups.forEach((nodeIds, level) => {
    if (level === 0) return;
    
    const radius = baseRadius * level;
    const angleStep = (2 * Math.PI) / nodeIds.length;
    
    nodeIds.forEach((nodeId, index) => {
      const angle = angleStep * index - Math.PI / 2;
      positioned.set(nodeId, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    });
  });

  return nodes.map(node => {
    const pos = positioned.get(node.id);
    if (pos) {
      return { ...node, position: { x: pos.x, y: pos.y } };
    }
    return node;
  });
}

// Force-directed layout (simple spring simulation)
export function forceLayout(nodes: Node[], edges: Edge[], iterations = 50): Node[] {
  if (nodes.length === 0) return nodes;
  
  const positions = new Map<string, { x: number; y: number; vx: number; vy: number }>();
  
  // Initialize positions
  nodes.forEach((node, i) => {
    positions.set(node.id, {
      x: node.position.x || 400 + Math.random() * 200 - 100,
      y: node.position.y || 300 + Math.random() * 200 - 100,
      vx: 0,
      vy: 0,
    });
  });

  const repulsion = 5000;
  const attraction = 0.05;
  const damping = 0.9;
  const centerForce = 0.01;
  const centerX = 400;
  const centerY = 300;

  for (let iter = 0; iter < iterations; iter++) {
    // Repulsion between all nodes
    nodes.forEach(node1 => {
      const p1 = positions.get(node1.id)!;
      
      nodes.forEach(node2 => {
        if (node1.id === node2.id) return;
        
        const p2 = positions.get(node2.id)!;
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = repulsion / (dist * dist);
        
        p1.vx += (dx / dist) * force;
        p1.vy += (dy / dist) * force;
      });
      
      // Center gravity
      p1.vx += (centerX - p1.x) * centerForce;
      p1.vy += (centerY - p1.y) * centerForce;
    });

    // Attraction along edges
    edges.forEach(edge => {
      const p1 = positions.get(edge.source);
      const p2 = positions.get(edge.target);
      if (!p1 || !p2) return;
      
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      
      p1.vx += dx * attraction;
      p1.vy += dy * attraction;
      p2.vx -= dx * attraction;
      p2.vy -= dy * attraction;
    });

    // Apply velocities
    positions.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= damping;
      p.vy *= damping;
    });
  }

  return nodes.map(node => {
    const pos = positions.get(node.id);
    if (pos) {
      return { ...node, position: { x: pos.x, y: pos.y } };
    }
    return node;
  });
}

// Grid snap utility
export function snapToGrid(position: { x: number; y: number }, gridSize = 20): { x: number; y: number } {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

import { Node, Edge, MarkerType } from '@xyflow/react';

export interface MindMapTemplate {
  id: string;
  name: string;
  description: string;
  category: 'brainstorm' | 'planning' | 'analysis' | 'organization' | 'education';
  thumbnail: string; // emoji for now
  nodes: Node[];
  edges: Edge[];
}

const defaultEdgeStyle = {
  animated: true,
  style: { stroke: '#3b82f6', strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
};

export const MINDMAP_TEMPLATES: MindMapTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start from scratch with a single node',
    category: 'brainstorm',
    thumbnail: '📄',
    nodes: [
      {
        id: '1',
        type: 'custom',
        position: { x: 400, y: 250 },
        data: { label: 'Main Topic', color: '#3b82f6', shape: 'rounded', icon: 'lightbulb' },
      },
    ],
    edges: [],
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm',
    description: 'Central idea with branching thoughts',
    category: 'brainstorm',
    thumbnail: '💡',
    nodes: [
      {
        id: 'center',
        type: 'custom',
        position: { x: 400, y: 250 },
        data: { label: 'Central Idea', color: '#8b5cf6', shape: 'circle', icon: 'lightbulb' },
      },
      {
        id: 'idea1',
        type: 'custom',
        position: { x: 150, y: 100 },
        data: { label: 'Idea 1', color: '#3b82f6', shape: 'rounded', icon: 'star' },
      },
      {
        id: 'idea2',
        type: 'custom',
        position: { x: 650, y: 100 },
        data: { label: 'Idea 2', color: '#10b981', shape: 'rounded', icon: 'star' },
      },
      {
        id: 'idea3',
        type: 'custom',
        position: { x: 150, y: 400 },
        data: { label: 'Idea 3', color: '#f59e0b', shape: 'rounded', icon: 'star' },
      },
      {
        id: 'idea4',
        type: 'custom',
        position: { x: 650, y: 400 },
        data: { label: 'Idea 4', color: '#ec4899', shape: 'rounded', icon: 'star' },
      },
    ],
    edges: [
      { id: 'e1', source: 'center', target: 'idea1', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e2', source: 'center', target: 'idea2', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e3', source: 'center', target: 'idea3', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e4', source: 'center', target: 'idea4', type: 'bezier', ...defaultEdgeStyle },
    ],
  },
  {
    id: 'swot',
    name: 'SWOT Analysis',
    description: 'Strengths, Weaknesses, Opportunities, Threats',
    category: 'analysis',
    thumbnail: '📊',
    nodes: [
      {
        id: 'center',
        type: 'custom',
        position: { x: 400, y: 250 },
        data: { label: 'SWOT Analysis', color: '#6366f1', shape: 'rounded', icon: 'target' },
      },
      {
        id: 'strengths',
        type: 'custom',
        position: { x: 150, y: 80 },
        data: { label: 'Strengths', color: '#10b981', shape: 'default', icon: 'check' },
      },
      {
        id: 'weaknesses',
        type: 'custom',
        position: { x: 650, y: 80 },
        data: { label: 'Weaknesses', color: '#ef4444', shape: 'default', icon: 'alert' },
      },
      {
        id: 'opportunities',
        type: 'custom',
        position: { x: 150, y: 420 },
        data: { label: 'Opportunities', color: '#3b82f6', shape: 'default', icon: 'trending' },
      },
      {
        id: 'threats',
        type: 'custom',
        position: { x: 650, y: 420 },
        data: { label: 'Threats', color: '#f59e0b', shape: 'default', icon: 'flag' },
      },
      // Sub-items
      { id: 's1', type: 'custom', position: { x: 50, y: 0 }, data: { label: 'Strength 1', color: '#10b981', shape: 'rounded' } },
      { id: 'w1', type: 'custom', position: { x: 750, y: 0 }, data: { label: 'Weakness 1', color: '#ef4444', shape: 'rounded' } },
      { id: 'o1', type: 'custom', position: { x: 50, y: 500 }, data: { label: 'Opportunity 1', color: '#3b82f6', shape: 'rounded' } },
      { id: 't1', type: 'custom', position: { x: 750, y: 500 }, data: { label: 'Threat 1', color: '#f59e0b', shape: 'rounded' } },
    ],
    edges: [
      { id: 'e1', source: 'center', target: 'strengths', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e2', source: 'center', target: 'weaknesses', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e3', source: 'center', target: 'opportunities', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e4', source: 'center', target: 'threats', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e5', source: 'strengths', target: 's1', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e6', source: 'weaknesses', target: 'w1', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e7', source: 'opportunities', target: 'o1', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e8', source: 'threats', target: 't1', type: 'bezier', ...defaultEdgeStyle },
    ],
  },
  {
    id: 'orgchart',
    name: 'Organization Chart',
    description: 'Hierarchical team structure',
    category: 'organization',
    thumbnail: '👥',
    nodes: [
      {
        id: 'ceo',
        type: 'custom',
        position: { x: 400, y: 50 },
        data: { label: 'CEO', color: '#8b5cf6', shape: 'rounded', icon: 'award' },
      },
      {
        id: 'cto',
        type: 'custom',
        position: { x: 200, y: 180 },
        data: { label: 'CTO', color: '#3b82f6', shape: 'default', icon: 'settings' },
      },
      {
        id: 'cfo',
        type: 'custom',
        position: { x: 400, y: 180 },
        data: { label: 'CFO', color: '#10b981', shape: 'default', icon: 'trending' },
      },
      {
        id: 'cmo',
        type: 'custom',
        position: { x: 600, y: 180 },
        data: { label: 'CMO', color: '#ec4899', shape: 'default', icon: 'users' },
      },
      {
        id: 'dev1',
        type: 'custom',
        position: { x: 100, y: 310 },
        data: { label: 'Dev Team', color: '#3b82f6', shape: 'rounded' },
      },
      {
        id: 'dev2',
        type: 'custom',
        position: { x: 300, y: 310 },
        data: { label: 'QA Team', color: '#3b82f6', shape: 'rounded' },
      },
      {
        id: 'finance',
        type: 'custom',
        position: { x: 400, y: 310 },
        data: { label: 'Finance', color: '#10b981', shape: 'rounded' },
      },
      {
        id: 'marketing',
        type: 'custom',
        position: { x: 600, y: 310 },
        data: { label: 'Marketing', color: '#ec4899', shape: 'rounded' },
      },
    ],
    edges: [
      { id: 'e1', source: 'ceo', target: 'cto', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e2', source: 'ceo', target: 'cfo', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e3', source: 'ceo', target: 'cmo', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e4', source: 'cto', target: 'dev1', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e5', source: 'cto', target: 'dev2', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e6', source: 'cfo', target: 'finance', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e7', source: 'cmo', target: 'marketing', type: 'smoothstep', ...defaultEdgeStyle },
    ],
  },
  {
    id: 'flowchart',
    name: 'Flowchart',
    description: 'Process flow with decision points',
    category: 'planning',
    thumbnail: '🔄',
    nodes: [
      {
        id: 'start',
        type: 'custom',
        position: { x: 400, y: 50 },
        data: { label: 'Start', color: '#10b981', shape: 'circle', icon: 'zap' },
      },
      {
        id: 'step1',
        type: 'custom',
        position: { x: 400, y: 150 },
        data: { label: 'Step 1', color: '#3b82f6', shape: 'default' },
      },
      {
        id: 'decision',
        type: 'custom',
        position: { x: 400, y: 250 },
        data: { label: 'Decision?', color: '#f59e0b', shape: 'diamond' },
      },
      {
        id: 'yes',
        type: 'custom',
        position: { x: 250, y: 380 },
        data: { label: 'Yes Path', color: '#10b981', shape: 'default' },
      },
      {
        id: 'no',
        type: 'custom',
        position: { x: 550, y: 380 },
        data: { label: 'No Path', color: '#ef4444', shape: 'default' },
      },
      {
        id: 'end',
        type: 'custom',
        position: { x: 400, y: 500 },
        data: { label: 'End', color: '#6b7280', shape: 'circle', icon: 'check' },
      },
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'step1', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e2', source: 'step1', target: 'decision', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e3', source: 'decision', target: 'yes', type: 'smoothstep', label: 'Yes', ...defaultEdgeStyle },
      { id: 'e4', source: 'decision', target: 'no', type: 'smoothstep', label: 'No', ...defaultEdgeStyle },
      { id: 'e5', source: 'yes', target: 'end', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e6', source: 'no', target: 'end', type: 'smoothstep', ...defaultEdgeStyle },
    ],
  },
  {
    id: 'project',
    name: 'Project Planning',
    description: 'Project phases and milestones',
    category: 'planning',
    thumbnail: '📋',
    nodes: [
      {
        id: 'project',
        type: 'custom',
        position: { x: 400, y: 50 },
        data: { label: 'Project Name', color: '#8b5cf6', shape: 'rounded', icon: 'folder' },
      },
      {
        id: 'phase1',
        type: 'custom',
        position: { x: 150, y: 180 },
        data: { label: 'Phase 1: Planning', color: '#3b82f6', shape: 'default', icon: 'file' },
      },
      {
        id: 'phase2',
        type: 'custom',
        position: { x: 400, y: 180 },
        data: { label: 'Phase 2: Development', color: '#10b981', shape: 'default', icon: 'settings' },
      },
      {
        id: 'phase3',
        type: 'custom',
        position: { x: 650, y: 180 },
        data: { label: 'Phase 3: Launch', color: '#f59e0b', shape: 'default', icon: 'zap' },
      },
      {
        id: 'task1',
        type: 'custom',
        position: { x: 80, y: 310 },
        data: { label: 'Research', color: '#3b82f6', shape: 'rounded' },
      },
      {
        id: 'task2',
        type: 'custom',
        position: { x: 220, y: 310 },
        data: { label: 'Requirements', color: '#3b82f6', shape: 'rounded' },
      },
      {
        id: 'task3',
        type: 'custom',
        position: { x: 330, y: 310 },
        data: { label: 'Design', color: '#10b981', shape: 'rounded' },
      },
      {
        id: 'task4',
        type: 'custom',
        position: { x: 470, y: 310 },
        data: { label: 'Build', color: '#10b981', shape: 'rounded' },
      },
      {
        id: 'task5',
        type: 'custom',
        position: { x: 580, y: 310 },
        data: { label: 'Testing', color: '#f59e0b', shape: 'rounded' },
      },
      {
        id: 'task6',
        type: 'custom',
        position: { x: 720, y: 310 },
        data: { label: 'Deploy', color: '#f59e0b', shape: 'rounded' },
      },
    ],
    edges: [
      { id: 'e1', source: 'project', target: 'phase1', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e2', source: 'project', target: 'phase2', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e3', source: 'project', target: 'phase3', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e4', source: 'phase1', target: 'task1', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e5', source: 'phase1', target: 'task2', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e6', source: 'phase2', target: 'task3', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e7', source: 'phase2', target: 'task4', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e8', source: 'phase3', target: 'task5', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e9', source: 'phase3', target: 'task6', type: 'smoothstep', ...defaultEdgeStyle },
    ],
  },
  {
    id: 'lesson',
    name: 'Lesson Plan',
    description: 'Educational content structure',
    category: 'education',
    thumbnail: '📚',
    nodes: [
      {
        id: 'topic',
        type: 'custom',
        position: { x: 400, y: 50 },
        data: { label: 'Lesson Topic', color: '#8b5cf6', shape: 'rounded', icon: 'bookmark' },
      },
      {
        id: 'objectives',
        type: 'custom',
        position: { x: 150, y: 180 },
        data: { label: 'Learning Objectives', color: '#3b82f6', shape: 'default', icon: 'target' },
      },
      {
        id: 'content',
        type: 'custom',
        position: { x: 400, y: 180 },
        data: { label: 'Content', color: '#10b981', shape: 'default', icon: 'file' },
      },
      {
        id: 'activities',
        type: 'custom',
        position: { x: 650, y: 180 },
        data: { label: 'Activities', color: '#f59e0b', shape: 'default', icon: 'zap' },
      },
      {
        id: 'obj1',
        type: 'custom',
        position: { x: 80, y: 310 },
        data: { label: 'Objective 1', color: '#3b82f6', shape: 'rounded' },
      },
      {
        id: 'obj2',
        type: 'custom',
        position: { x: 220, y: 310 },
        data: { label: 'Objective 2', color: '#3b82f6', shape: 'rounded' },
      },
      {
        id: 'section1',
        type: 'custom',
        position: { x: 350, y: 310 },
        data: { label: 'Section 1', color: '#10b981', shape: 'rounded' },
      },
      {
        id: 'section2',
        type: 'custom',
        position: { x: 450, y: 310 },
        data: { label: 'Section 2', color: '#10b981', shape: 'rounded' },
      },
      {
        id: 'activity1',
        type: 'custom',
        position: { x: 580, y: 310 },
        data: { label: 'Quiz', color: '#f59e0b', shape: 'rounded' },
      },
      {
        id: 'activity2',
        type: 'custom',
        position: { x: 720, y: 310 },
        data: { label: 'Discussion', color: '#f59e0b', shape: 'rounded' },
      },
    ],
    edges: [
      { id: 'e1', source: 'topic', target: 'objectives', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e2', source: 'topic', target: 'content', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e3', source: 'topic', target: 'activities', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e4', source: 'objectives', target: 'obj1', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e5', source: 'objectives', target: 'obj2', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e6', source: 'content', target: 'section1', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e7', source: 'content', target: 'section2', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e8', source: 'activities', target: 'activity1', type: 'smoothstep', ...defaultEdgeStyle },
      { id: 'e9', source: 'activities', target: 'activity2', type: 'smoothstep', ...defaultEdgeStyle },
    ],
  },
  {
    id: 'pros-cons',
    name: 'Pros & Cons',
    description: 'Compare advantages and disadvantages',
    category: 'analysis',
    thumbnail: '⚖️',
    nodes: [
      {
        id: 'topic',
        type: 'custom',
        position: { x: 400, y: 50 },
        data: { label: 'Decision Topic', color: '#6366f1', shape: 'rounded', icon: 'target' },
      },
      {
        id: 'pros',
        type: 'custom',
        position: { x: 200, y: 180 },
        data: { label: 'Pros ✓', color: '#10b981', shape: 'default', icon: 'check' },
      },
      {
        id: 'cons',
        type: 'custom',
        position: { x: 600, y: 180 },
        data: { label: 'Cons ✗', color: '#ef4444', shape: 'default', icon: 'alert' },
      },
      {
        id: 'pro1',
        type: 'custom',
        position: { x: 100, y: 310 },
        data: { label: 'Pro 1', color: '#10b981', shape: 'rounded' },
      },
      {
        id: 'pro2',
        type: 'custom',
        position: { x: 200, y: 380 },
        data: { label: 'Pro 2', color: '#10b981', shape: 'rounded' },
      },
      {
        id: 'pro3',
        type: 'custom',
        position: { x: 100, y: 450 },
        data: { label: 'Pro 3', color: '#10b981', shape: 'rounded' },
      },
      {
        id: 'con1',
        type: 'custom',
        position: { x: 700, y: 310 },
        data: { label: 'Con 1', color: '#ef4444', shape: 'rounded' },
      },
      {
        id: 'con2',
        type: 'custom',
        position: { x: 600, y: 380 },
        data: { label: 'Con 2', color: '#ef4444', shape: 'rounded' },
      },
      {
        id: 'con3',
        type: 'custom',
        position: { x: 700, y: 450 },
        data: { label: 'Con 3', color: '#ef4444', shape: 'rounded' },
      },
    ],
    edges: [
      { id: 'e1', source: 'topic', target: 'pros', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e2', source: 'topic', target: 'cons', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e3', source: 'pros', target: 'pro1', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e4', source: 'pros', target: 'pro2', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e5', source: 'pros', target: 'pro3', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e6', source: 'cons', target: 'con1', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e7', source: 'cons', target: 'con2', type: 'bezier', ...defaultEdgeStyle },
      { id: 'e8', source: 'cons', target: 'con3', type: 'bezier', ...defaultEdgeStyle },
    ],
  },
];

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates' },
  { id: 'brainstorm', name: 'Brainstorming' },
  { id: 'planning', name: 'Planning' },
  { id: 'analysis', name: 'Analysis' },
  { id: 'organization', name: 'Organization' },
  { id: 'education', name: 'Education' },
];

export function getTemplateById(id: string): MindMapTemplate | undefined {
  return MINDMAP_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): MindMapTemplate[] {
  if (category === 'all') return MINDMAP_TEMPLATES;
  return MINDMAP_TEMPLATES.filter(t => t.category === category);
}

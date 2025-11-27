import { Node, Edge, MarkerType } from '@xyflow/react';

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Access keys required to use AI features
const ACCESS_KEYS = ['elsondev26', 'irenendonde'];

export function validateAccessKey(key: string): boolean {
  return ACCESS_KEYS.includes(key.toLowerCase().trim());
}

interface MindMapNode {
  id: string;
  label: string;
  color?: string;
  shape?: string;
  icon?: string;
  children?: MindMapNode[];
}

interface AIGeneratedMindMap {
  title: string;
  nodes: MindMapNode[];
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444', '#14b8a6', '#6366f1'];

function getRandomColor(index: number): string {
  return COLORS[index % COLORS.length];
}

function convertToReactFlowNodes(
  aiNodes: MindMapNode[],
  parentId: string | null = null,
  startX: number = 400,
  startY: number = 100,
  level: number = 0
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  const spacing = 200;
  const levelSpacing = 150;
  
  aiNodes.forEach((aiNode, index) => {
    const x = startX + (index - (aiNodes.length - 1) / 2) * spacing;
    const y = startY + level * levelSpacing;
    
    const node: Node = {
      id: aiNode.id,
      type: 'custom',
      position: { x, y },
      data: {
        label: aiNode.label,
        color: aiNode.color || getRandomColor(level + index),
        shape: aiNode.shape || (level === 0 ? 'rounded' : 'default'),
        icon: aiNode.icon || (level === 0 ? 'lightbulb' : 'none'),
      },
    };
    nodes.push(node);

    if (parentId) {
      const edge: Edge = {
        id: `edge-${parentId}-${aiNode.id}`,
        source: parentId,
        target: aiNode.id,
        type: 'bezier',
        animated: true,
        style: { stroke: getRandomColor(level), strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: getRandomColor(level) },
      };
      edges.push(edge);
    }

    if (aiNode.children && aiNode.children.length > 0) {
      const childResult = convertToReactFlowNodes(
        aiNode.children,
        aiNode.id,
        x,
        y,
        level + 1
      );
      nodes.push(...childResult.nodes);
      edges.push(...childResult.edges);
    }
  });

  return { nodes, edges };
}


export async function generateMindMapFromText(
  topic: string,
  additionalContext?: string
): Promise<{ nodes: Node[]; edges: Edge[]; title: string }> {
  const prompt = `Generate a mind map structure for the topic: "${topic}"
${additionalContext ? `Additional context: ${additionalContext}` : ''}

Return a JSON object with this exact structure:
{
  "title": "Main topic title",
  "nodes": [
    {
      "id": "1",
      "label": "Central Topic",
      "children": [
        {
          "id": "1-1",
          "label": "Subtopic 1",
          "children": [
            { "id": "1-1-1", "label": "Detail 1" },
            { "id": "1-1-2", "label": "Detail 2" }
          ]
        },
        {
          "id": "1-2",
          "label": "Subtopic 2",
          "children": []
        }
      ]
    }
  ]
}

Rules:
- Create 3-5 main branches from the central topic
- Each branch should have 2-4 sub-items
- Keep labels concise (2-5 words)
- Make it educational and well-organized
- Return ONLY valid JSON, no markdown or explanation`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a mind map generator. You create well-structured, educational mind maps. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in response');
    }

    // Parse JSON from response (handle potential markdown code blocks)
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    }
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    const mindMapData: AIGeneratedMindMap = JSON.parse(jsonStr);
    const { nodes, edges } = convertToReactFlowNodes(mindMapData.nodes);
    
    return { nodes, edges, title: mindMapData.title };
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}


export async function generateMindMapFromImage(
  imageBase64: string,
  additionalPrompt?: string
): Promise<{ nodes: Node[]; edges: Edge[]; title: string }> {
  const prompt = `Analyze this image and create a mind map structure based on its content.
${additionalPrompt ? `Focus on: ${additionalPrompt}` : ''}

Return a JSON object with this exact structure:
{
  "title": "Main topic from image",
  "nodes": [
    {
      "id": "1",
      "label": "Central Topic",
      "children": [
        {
          "id": "1-1",
          "label": "Subtopic 1",
          "children": [
            { "id": "1-1-1", "label": "Detail 1" }
          ]
        }
      ]
    }
  ]
}

Rules:
- Identify the main subject/topic from the image
- Create 3-5 main branches based on what you see
- Each branch should have 2-4 relevant sub-items
- Keep labels concise (2-5 words)
- Return ONLY valid JSON, no markdown or explanation`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.2-90b-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in response');
    }

    // Parse JSON from response
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    }
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    const mindMapData: AIGeneratedMindMap = JSON.parse(jsonStr);
    const { nodes, edges } = convertToReactFlowNodes(mindMapData.nodes);
    
    return { nodes, edges, title: mindMapData.title };
  } catch (error) {
    console.error('AI image analysis error:', error);
    throw error;
  }
}

export async function expandNodeWithAI(
  nodeLabel: string,
  context?: string
): Promise<{ label: string; children: string[] }[]> {
  const prompt = `Expand on this mind map node: "${nodeLabel}"
${context ? `Context: ${context}` : ''}

Generate 3-4 sub-topics for this node. Return a JSON array:
[
  { "label": "Subtopic 1", "children": ["Detail 1", "Detail 2"] },
  { "label": "Subtopic 2", "children": ["Detail 1"] }
]

Keep labels concise. Return ONLY valid JSON.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a mind map expander. Generate relevant subtopics. Return only valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to expand node');
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content?.trim() || '[]';
    
    if (content.startsWith('```')) {
      content = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('AI expand error:', error);
    throw error;
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Notes Service
export async function getNotes(userId: string) {
  return fetchAPI('/notes');
}

export async function getNote(id: string, userId: string) {
  return fetchAPI(`/notes/${id}`);
}

export async function createNote(userId: string, title: string, content: string | Record<string, unknown>) {
  // Ensure content is a string for storage
  const contentString = typeof content === 'string' ? content : JSON.stringify(content);
  return fetchAPI('/notes', {
    method: 'POST',
    body: JSON.stringify({ title, content: contentString }),
  });
}

export async function updateNote(id: string, userId: string, title: string, content: string | Record<string, unknown>) {
  // Ensure content is a string for storage
  const contentString = typeof content === 'string' ? content : JSON.stringify(content);
  return fetchAPI(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content: contentString }),
  });
}

export async function deleteNote(id: string, userId: string) {
  return fetchAPI(`/notes/${id}`, {
    method: 'DELETE',
  });
}

// Mind Maps Service
export async function getMindMaps(userId: string) {
  return fetchAPI('/mindmaps');
}

export async function getMindMap(id: string, userId: string) {
  return fetchAPI(`/mindmaps/${id}`);
}

export async function createMindMap(userId: string, title: string, nodes: unknown, edges: unknown) {
  return fetchAPI('/mindmaps', {
    method: 'POST',
    body: JSON.stringify({ title, nodes, edges }),
  });
}

export async function updateMindMap(id: string, userId: string, title: string, nodes: unknown, edges: unknown) {
  return fetchAPI(`/mindmaps/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, nodes, edges }),
  });
}

export async function deleteMindMap(id: string, userId: string) {
  return fetchAPI(`/mindmaps/${id}`, {
    method: 'DELETE',
  });
}

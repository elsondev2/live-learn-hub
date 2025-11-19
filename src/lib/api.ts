const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'TEACHER' | 'STUDENT';
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: 'TEACHER' | 'STUDENT'
): Promise<AuthResponse> {
  return fetchAPI('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, role }),
  });
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  return fetchAPI('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const data = await fetchAPI('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.user;
  } catch (error) {
    return null;
  }
}

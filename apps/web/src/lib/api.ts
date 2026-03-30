// Centralized API client for all backend calls

const API_BASE = '/api';

interface ApiError {
  error: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const body = await res.json().catch(() => ({})) as ApiError;
  
  if (!res.ok) {
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return body as T;
}

export const api = {
  // GET request
  get: <T>(path: string) => request<T>(path),

  // POST request
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // PUT request
  put: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  // DELETE request
  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};
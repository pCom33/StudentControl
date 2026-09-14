const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000/api';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('studentcontrol_token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Nao foi possivel estabelecer ligacao ao servidor.');
  }
  return data;
}

export async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function getResource(path) {
  return apiRequest(path);
}

export function createResource(path, body) {
  return apiRequest(path, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export function updateResource(path, body) {
  return apiRequest(path, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

export function deleteResource(path) {
  return apiRequest(path, { method: 'DELETE' });
}

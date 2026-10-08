const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...options });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? 'Request failed.');
  return body;
}

export function analyzeImage(file) {
  const form = new FormData(); form.append('image', file);
  return request('/analysis/analyze', { method: 'POST', body: form });
}
export function register(email, password) { return request('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); }
export function login(email, password) { return request('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); }
export function logout() { return request('/auth/logout', { method: 'POST' }); }
export function refresh() { return request('/auth/refresh', { method: 'POST' }); }
export function getHistory() { return request('/analysis/history'); }

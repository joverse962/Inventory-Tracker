function normalizeApiOrigin(url?: string): string {
  const fallback = 'http://localhost:3000';
  const raw = (url || fallback).trim().replace(/\/+$/, '');
  return raw.endsWith('/api') ? raw.slice(0, -4) : raw;
}

// API origin should be backend origin (without /api suffix)
export const API_ORIGIN = import.meta.env.DEV
  ? 'http://localhost:3000'
  : normalizeApiOrigin(import.meta.env.PUBLIC_API_URL);

const API_BASE = `${API_ORIGIN}/api`;

// Get auth token
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Get current user
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Logout
export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

// Check if authenticated
export function isAuthenticated(): boolean {
  return !!getToken();
}

// Auth headers
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Generic API request
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${normalizedEndpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      logout();
    }
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Auth API
export const authAPI = {
  login: (email: string, password: string, asAdmin = false) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, asAdmin }),
    }),

  register: (name: string, email: string, password: string) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => apiRequest('/auth/me', { method: 'GET' }),
};

export const adminAPI = {
  getDashboard: () => apiRequest('/admin/dashboard', { method: 'GET' }),
  listStorages: () => apiRequest('/admin/storages', { method: 'GET' }),
  createStorage: (name: string) =>
    apiRequest('/admin/storages', { method: 'POST', body: JSON.stringify({ name }) }),
  updateStorage: (id: string, name: string) =>
    apiRequest(`/admin/storages/${id}`, { method: 'PUT', body: JSON.stringify({ name }) }),
  deleteStorage: (id: string) =>
    apiRequest(`/admin/storages/${id}`, { method: 'DELETE' }),

  setAllItemsToBasement: () =>
    apiRequest('/admin/items/set-basement', { method: 'POST' }),
};

// Items API
export const itemsAPI = {
  getAll: (filters?: {
    availability?: string;
    status?: string;
    category?: string;
    location?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.availability) params.append('availability', filters.availability);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return apiRequest(`/items${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  getById: (id: string) => apiRequest(`/items/${id}`, { method: 'GET' }),

  create: (item: any) => {
    console.log('[Items API] Creating item with data:', item);
    return apiRequest('/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  update: (id: string, item: any) =>
    apiRequest(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    }),

  delete: (id: string) => apiRequest(`/items/${id}`, { method: 'DELETE' }),

  borrow: (id: string, quantity: number = 1) =>
    apiRequest(`/items/${id}/borrow`, { method: 'POST', body: JSON.stringify({ quantity }) }),

  take: (id: string, quantity: number = 1) =>
    apiRequest(`/items/${id}/take`, { method: 'POST', body: JSON.stringify({ quantity }) }),

  return: (id: string, quantity?: number) =>
    apiRequest(`/items/${id}/return`, { method: 'POST', body: quantity ? JSON.stringify({ quantity }) : undefined }),

  updateStatus: (id: string, instanceId: string, status: 'good' | 'waste' | 'need_repairing') =>
    apiRequest(`/items/${id}/update-condition`, {
      method: 'POST',
      body: JSON.stringify({ instanceId, condition: status }),
    }),

  getMyHistory: () => apiRequest('/items/history/me', { method: 'GET' }),

  getByBarcode: async (_barcode: string) => {
    throw new Error('Barcode lookup endpoint is not available in the current backend.');
  },

  getStorages: () => apiRequest('/items/storages', { method: 'GET' }),
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    console.log('[Upload API] Starting upload for file:', file.name, 'Size:', file.size);
    const formData = new FormData();
    formData.append('file', file);

    const token = getToken();
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json();
    console.log('[Upload API] Response:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data;
  },
};

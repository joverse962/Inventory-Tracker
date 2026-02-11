// API Base URL
const API_URL = import.meta.env.PUBLIC_API_URL || '';

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
  const url = `${API_URL}${endpoint}`;
  
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
  login: (email: string, password: string) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => apiRequest('/api/auth/me', { method: 'GET' }),
};

// Items API
export const itemsAPI = {
  getAll: (filters?: {
    status?: string;
    category?: string;
    location?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return apiRequest(`/api/items${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  getById: (id: string) => apiRequest(`/api/items/${id}`, { method: 'GET' }),

  create: (item: any) => {
    console.log('[Items API] Creating item with data:', item);
    return apiRequest('/api/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  update: (id: string, item: any) =>
    apiRequest(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    }),

  delete: (id: string) => apiRequest(`/api/items/${id}`, { method: 'DELETE' }),

  borrow: (id: string) =>
    apiRequest(`/api/items/borrow/${id}`, { method: 'POST' }),

  return: (id: string) =>
    apiRequest(`/api/items/return/${id}`, { method: 'POST' }),

  getByBarcode: (barcode: string) =>
    apiRequest(`/api/items/barcode/${barcode}`, { method: 'GET' }),
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    console.log('[Upload API] Starting upload for file:', file.name, 'Size:', file.size);
    const formData = new FormData();
    formData.append('file', file);

    const token = getToken();
    const response = await fetch(`${API_URL}/api/upload`, {
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

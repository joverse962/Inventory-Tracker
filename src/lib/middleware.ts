// Auth check middleware for client-side
export function checkAuth() {
  if (typeof window === 'undefined') return;
  
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;
  const publicPages = ['/login'];
  const currentPath = window.location.pathname;
  
  if (!token && !publicPages.includes(currentPath)) {
    window.location.href = '/login';
  }
  
  if (token && publicPages.includes(currentPath)) {
    window.location.href = user?.role === 'admin' ? '/admin' : '/';
  }
}

// Run on page load
if (typeof window !== 'undefined') {
  checkAuth();
}

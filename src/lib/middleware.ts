// Auth check middleware for client-side
export function checkAuth() {
  if (typeof window === 'undefined') return;
  
  const token = localStorage.getItem('token');
  const publicPages = ['/login'];
  const currentPath = window.location.pathname;
  
  if (!token && !publicPages.includes(currentPath)) {
    window.location.href = '/login';
  }
  
  if (token && publicPages.includes(currentPath)) {
    window.location.href = '/';
  }
}

// Run on page load
if (typeof window !== 'undefined') {
  checkAuth();
}

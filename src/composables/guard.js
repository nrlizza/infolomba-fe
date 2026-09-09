import { useAuth } from './useAuth';

export async function globalAuthGuard(to, from, next) {
  const { getToken, getUser, refreshToken } = useAuth();
  const accessToken = getToken();
  const requiresAuth = to.meta.requiresAuth;
  const guestOnly = to.meta.guestOnly;
  const adminGuestOnly = to.meta.adminGuestOnly;
  const allowedRoles = to.meta.allowedRoles;

  // Jika halaman adminGuestOnly (misal /admin-login) dan sudah ada token
  if (adminGuestOnly && accessToken) {
    const user = getUser();
    if (user?.role?.toUpperCase() === 'ADMIN') {
      return next({ path: '/admin-dashboard' });
    }
    return next({ path: '/beranda' });
  }

  // Jika halaman guestOnly (misal /login, /register) dan sudah login
  if (guestOnly && accessToken) {
    return next({ path: '/' });
  }

  if (requiresAuth && !accessToken) {
    try {
      await refreshToken(); // jika berhasil, token baru otomatis diset
      return next();
    } catch {
      return next({ path: '/login' });
    }
  }

  if (accessToken) {
    const user = getUser();
    if (!user) {
      return next({ path: '/login' });
    }

    const userRole = user.role.toUpperCase();
    
    // Admin hanya boleh mengakses halaman yang secara eksplisit mengizinkan ADMIN
    if (userRole === 'ADMIN') {
      if (!allowedRoles || !allowedRoles.includes('ADMIN')) {
        return next({ path: '/admin-dashboard' });
      }
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return next({ name: 'Forbidden' });
    }
  }

  next();
}
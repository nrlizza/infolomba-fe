import { useAuth } from './useAuth';

export async function globalAuthGuard(to, from, next) {
  const { getToken, getUser, refreshToken } = useAuth();
  const accessToken = getToken();
  const requiresAuth = to.meta.requiresAuth;
  const guestOnly = to.meta.guestOnly;
  const allowedRoles = to.meta.allowedRoles;

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
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return next({ name: 'Forbidden' });
    }
  }

  next();
}
 
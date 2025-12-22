import { jwtDecode } from 'jwt-decode';
import cookie from 'vue-cookies';
import axios from 'axios';

export function useAuth() {
  const getToken = () => cookie.get('token');

  const getUser = () => {
    try {
      const token = getToken();
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded;
    } catch {
      return null;
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_AR_URL}auth/refresh`,
        {},
        { withCredentials: true }
      );
      const newAccessToken = res.data.accessToken;
      cookie.set('token', newAccessToken, '1h');
      return newAccessToken;
    } catch (err) {
      cookie.remove('token');
      throw err;
    }
  };

  const logout = () => {
    cookie.remove('token');
    window.location.href = '/login';
  };

  return {
    getToken,
    getUser,
    refreshToken,
    logout,
  };
}

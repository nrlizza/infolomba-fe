import axios from 'axios';
import cookie from 'vue-cookies';

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_INFO_LOMBA_URL,
  withCredentials: true, // supaya refreshToken HttpOnly tetap dikirim
});

// ✅ Interceptor: tambahkan token ke setiap request
AxiosInstance.interceptors.request.use((config) => {
  const token = cookie.get('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

// ✅ Interceptor: handle token expired
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Pastikan hanya retry jika belum pernah dicoba
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token (HttpOnly cookie otomatis dikirim karena withCredentials: true)
        const res = await axios.post(
          `${import.meta.env.VITE_API_INFO_LOMBA_URL}auth/refresh`,
          {},
          { withCredentials: true } // penting: tetap pakai axios default, bukan AxiosInstance
        );

        const newAccessToken = res.data.accessToken;

        // Simpan token baru ke cookie (non-HttpOnly)
        cookie.set('token', newAccessToken, '1h'); // tambahkan masa aktif agar tidak "hilang"

        // Set token baru ke header dan retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh gagal: hapus token, redirect login
        cookie.remove('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;

import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('musicas_missa_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.debug('[frontend][api] request', {
    method: config.method,
    url: `${config.baseURL ?? ''}${config.url ?? ''}`,
    params: config.params,
  });

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('[frontend][api] Acesso não autorizado ou sessão expirada.');
    }
    return Promise.reject(error);
  }
);
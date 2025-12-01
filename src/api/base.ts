import axios, { AxiosInstance } from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.APP_URL || '';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

let currentToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  currentToken = token;
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

if (BASE_URL === '') {
  const MockAdapter = async (config: any) => {
    const method = (config.method || 'get').toLowerCase();
    const url = config.url || '';
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});

    type MockUser = { id: string; name: string; email: string; role: 'admin' | 'parent' | 'driver'; password: string };
    const users: MockUser[] = [ { id: '1', name: 'Admin', email: 'admin', role: 'admin', password: '123' } ];

    const make = (data: any, status = 200) => ({
      data,
      status,
      statusText: status === 200 ? 'OK' : 'ERROR',
      headers: {},
      config,
    });

    if (method === 'post' && url === '/auth/login') {
      const { email, password } = body || {};
      const user = users.find(u => u.email === email);
      if (!user) return make({ message: 'Usuario no existe' }, 401);
      if (user.password !== password) return make({ message: 'Credenciales inválidas' }, 401);
      const token = `mock-token-${user.id}`;
      setAuthToken(token);
      return make({ token, user: { id: user.id, name: user.name, role: user.role } });
    }

    if (method === 'post' && url === '/auth/register') {
      const { name, email, password, role = 'parent' } = body || {};
      const exists = users.some(u => u.email === email);
      if (exists) return make({ message: 'Usuario ya existe' }, 409);
      const id = String(users.length + 1);
      const newUser: MockUser = { id, name: name || email, email, password, role: role as any };
      users.push(newUser);
      const token = `mock-token-${id}`;
      setAuthToken(token);
      return make({ token, user: { id, name: newUser.name, email, role } });
    }

    if (method === 'post' && url === '/auth/logout') {
      setAuthToken(null);
      return make({ ok: true });
    }

    return make({ message: 'Ruta no disponible en mock' }, 404);
  };
  (api as any).defaults.adapter = MockAdapter;
}

api.interceptors.request.use(
  (config) => {
    if (currentToken) config.headers.Authorization = `Bearer ${currentToken}`;
    try {
      const method = (config.method || 'GET').toUpperCase();
      const url = `${config.baseURL || ''}${config.url || ''}`;
      const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      const safeData = data && typeof data === 'object'
        ? { ...data, password: (data as any)?.password !== undefined ? '***' : (data as any)?.password }
        : data;
      console.log('[API] Request', method, url, safeData);
    } catch {}
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    try {
      const method = (response.config.method || 'GET').toUpperCase();
      const url = `${response.config.baseURL || ''}${response.config.url || ''}`;
      const data = response?.data;
      const safeData = data && typeof data === 'object'
        ? { ...data, api_token: (data as any)?.api_token ? '[token]' : (data as any)?.api_token, token: (data as any)?.token ? '[token]' : (data as any)?.token }
        : data;
      console.log('[API] Response', method, url, response.status, safeData);
    } catch {}
    return response;
  },
  (error) => {
    try {
      const cfg = error?.config || {};
      const method = (cfg.method || 'GET').toUpperCase();
      const url = `${cfg.baseURL || ''}${cfg.url || ''}`;
      const status = error?.response?.status;
      const data = error?.response?.data;
      const safeData = data && typeof data === 'object'
        ? { ...data, api_token: (data as any)?.api_token ? '[token]' : (data as any)?.api_token, token: (data as any)?.token ? '[token]' : (data as any)?.token }
        : data;
      console.log('[API] Error', method, url, status, safeData || error?.message || error);
    } catch {}
    return Promise.reject(error);
  }
);

export default api;
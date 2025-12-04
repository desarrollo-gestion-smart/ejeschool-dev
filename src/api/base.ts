import axios, { AxiosInstance, AxiosResponse } from 'axios';  
import Config from 'react-native-config';


const BASE_URL = (Config as any)?.APP_DEV || (Config as any)?.APP_URL || (Config as any)?.APP_url || 'https://dev.ejesatelital.com/api';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


type MockUser = { id: string; name: string; email: string; role: 'admin' | 'parent' | 'driver'; password: string };
const mockUsers: MockUser[] = [
  { id: '1', name: 'Admin', email: 'admin', role: 'admin', password: '123' },
  { id: '2', name: 'Driver', email: 'driver', role: 'driver', password: '123' },
];

let currentToken: string | null = null;
let currentCompanyId: number | null = null;

if (BASE_URL === '') {
  api.defaults.adapter = async (config) => {
    const method = (config.method || 'get').toLowerCase();
    const url = config.url || '';
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});

    const makeResponse = (data: any, status = 200): AxiosResponse => ({
      data,
      status,
      statusText: status === 200 ? 'OK' : 'ERROR',
      headers: {},
      config,
    });

    if (method === 'post' && url === '/auth/login') {
      const { email, password } = body || {};
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        return makeResponse({ message: 'Usuario no existe' }, 401);
      }
      if (user.password !== password) {
        return makeResponse({ message: 'Credenciales inválidas' }, 401);
      }
      currentToken = `mock-token-${user.id}`;
      return makeResponse({ token: currentToken, user: { id: user.id, name: user.name, role: user.role } });
    }

    if (method === 'post' && url === '/auth/register') {
      const { name, email, password, role = 'parent' } = body || {};
      const exists = mockUsers.some(u => u.email === email);
      if (exists) {
        return makeResponse({ message: 'Usuario ya existe' }, 409);
      }
      const id = String(mockUsers.length + 1);
      const newUser: MockUser = { id, name: name || email, email, password, role: role as any };
      mockUsers.push(newUser);
      currentToken = `mock-token-${id}`;
      return makeResponse({ token: currentToken, user: { id, name: newUser.name, email, role } });
    }

    if (method === 'post' && url === '/auth/logout') {
      currentToken = null;
      return makeResponse({ ok: true });
    }

    if (method === 'get' && url.startsWith('/users/')) {
      const id = url.split('/').pop() as string;
      const user = mockUsers.find(u => u.id === id);
      if (!user) return makeResponse({ message: 'Usuario no encontrado' }, 404);
      return makeResponse({ id: user.id, name: user.name, email: user.email, role: user.role });
    }

    if (method === 'put' && url.startsWith('/users/')) {
      const id = url.split('/').pop() as string;
      const idx = mockUsers.findIndex(u => u.id === id);
      if (idx === -1) return makeResponse({ message: 'Usuario no encontrado' }, 404);
      const updated = { ...mockUsers[idx], ...body } as MockUser;
      mockUsers[idx] = updated;
      return makeResponse({ id: updated.id, name: updated.name, email: updated.email, role: updated.role });
    }

    return makeResponse({ message: 'Ruta no disponible en mock' }, 404);
  };
}

api.interceptors.request.use(
  (config) => {
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    try {
      const method = String(config.method || 'get').toUpperCase();
      const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
      const headers = { ...(config.headers || {}) } as any;
      if (headers && headers.Authorization) {
        const tok = String(headers.Authorization).replace(/^Bearer\s+/, '');
        const masked = tok ? `${tok.slice(0, 6)}...${tok.slice(-4)}` : '';
        headers.Authorization = `Bearer ${masked}`;
      }
      console.log('API REQUEST', { method, url: fullUrl, headers, params: config.params });
    } catch {}
    return config;
  },
  (error) => Promise.reject(error)
);

export const setAuthToken = (token: string | null) => {
  currentToken = token;
};

export const getAuthToken = (): string | null => currentToken;

export const setCompanyId = (companyId: number | null) => {
  currentCompanyId = companyId ?? null;
};

export const getCompanyId = (): number | null => currentCompanyId;

export default api;

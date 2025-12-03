import api, { setAuthToken } from './base';

export interface LoginRequest {
  email: string;
  password: string;
  role?: 'parent' | 'driver' | 'admin';
}

export interface LoginResponse {
  id?: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email: string;
  avatar?: string;
  roles_id?: number[];
  is_activated?: boolean;
  api_token?: string;
  token?: string;
  [key: string]: any;
}

const extractToken = (data: any): string | null => {
  if (!data || typeof data !== 'object') return null;
  const direct = data.api_token || data.token || data.access_token;
  const nested = data?.data?.token || data?.data?.api_token || data?.fields?.api_token || data?.user?.api_token || data?.user?.token;
  return (direct || nested) ?? null;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);
  const payload = response.data;
  const token = extractToken(payload);
  setAuthToken(token);
  const masked = token ? `${String(token).slice(0, 6)}...${String(token).slice(-4)}` : null;
  console.log('auth.login token', masked);
  return { ...payload, api_token: token ?? payload?.api_token, token: token ?? payload?.token } as LoginResponse;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
  setAuthToken(null);
};


export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'parent' | 'driver' | 'admin';
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post('/auth/register', data);
  const payload = response.data;
  const token = extractToken(payload);
  setAuthToken(token);
  return { ...payload, token } as RegisterResponse;
};
export interface SocialRegisterResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const registerWithGoogle = async (data: SocialRegisterRequest): Promise<SocialRegisterResponse> => {
  const response = await api.post('/auth/google', data); 
  const payload = response.data;
  const token = extractToken(payload);
  setAuthToken(token);
  return { ...payload, token } as SocialRegisterResponse;
};

export interface SocialRegisterRequest {
  idToken: string; 
  role?: 'parent' | 'driver' | 'admin';
}

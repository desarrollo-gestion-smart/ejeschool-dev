import api, { setAuthToken } from './base';

export interface LoginRequest {
  email: string;
  password: string;
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

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);
  const payload = response.data;
  setAuthToken(payload?.api_token || payload?.token || null);
  return payload;
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
  setAuthToken(payload?.token || null);
  return payload;
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
  setAuthToken(payload?.token || null);
  return payload;
};

export interface SocialRegisterRequest {
  idToken: string; 
  role?: 'parent' | 'driver' | 'admin';
}

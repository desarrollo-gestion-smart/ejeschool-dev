import api from './base';

export interface LoginRequest {
  email: string;
  password: string;
  role: 'parent' | 'driver' | 'admin';
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
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
  return response.data;
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
  return response.data;
};

export interface SocialRegisterRequest {
  idToken: string; 
  role?: 'parent' | 'driver' | 'admin';
}
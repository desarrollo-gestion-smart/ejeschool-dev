import api from './base';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const getUserProfile = async (userId: string): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<User> => {
  const response = await api.put(`/users/${userId}`, data);
  return response.data;
};
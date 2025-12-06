import { User, UserCreationRequest, UserUpdateRequest } from '@/types/user.types';
import { getAuthToken } from '@/lib/auth';

const getApiBaseUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  return raw.endsWith('/api') ? raw : `${raw}/api`;
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const UserService = {
  // Create a new user
  async createUser(data: UserCreationRequest): Promise<User> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Erro ao criar usuário: ${response.status}`);
      }

      return response.json();
    } catch (error: unknown) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  // Get all users
  async getAllUsers(): Promise<User[]> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.content || [];
    } catch (error: unknown) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(id: number): Promise<User> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Usuário não encontrado');
      }

      return response.json();
    } catch (error: unknown) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  // Update a user
  async updateUser(id: number, data: UserUpdateRequest): Promise<User> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Erro ao atualizar usuário: ${response.status}`);
      }

      return response.json();
    } catch (error: unknown) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  // Delete a user
  async deleteUser(id: number): Promise<void> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Erro ao deletar usuário: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  },
};

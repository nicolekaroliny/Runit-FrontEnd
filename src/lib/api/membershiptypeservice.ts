import { MembershipType } from '@/types/user.types';
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

export interface MembershipTypeCreationRequest {
  name: string;
  monthlyPrice: number;
  description?: string;
}

export interface MembershipTypeUpdateRequest {
  name?: string;
  monthlyPrice?: number;
  description?: string;
}

export const MembershipTypeService = {
  // Get all membership types
  async getAllMembershipTypes(): Promise<MembershipType[]> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/membership-types`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar tipos de membership: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.content || [];
    } catch (error: unknown) {
      console.error('Erro ao buscar tipos de membership:', error);
      throw error;
    }
  },

  // Get membership type by ID
  async getMembershipTypeById(id: number): Promise<MembershipType> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/membership-types/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Tipo de membership não encontrado');
      }

      return response.json();
    } catch (error: unknown) {
      console.error('Erro ao buscar tipo de membership:', error);
      throw error;
    }
  },

  // Create membership type
  async createMembershipType(data: MembershipTypeCreationRequest): Promise<MembershipType> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/membership-types`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Erro ao criar membership: ${response.status}`);
      }

      return response.json();
    } catch (error: unknown) {
      console.error('Erro ao criar membership:', error);
      throw error;
    }
  },

  // Update membership type
  async updateMembershipType(id: number, data: MembershipTypeUpdateRequest): Promise<MembershipType> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/membership-types/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Erro ao atualizar membership: ${response.status}`);
      }

      return response.json();
    } catch (error: unknown) {
      console.error('Erro ao atualizar membership:', error);
      throw error;
    }
  },

  // Delete membership type
  async deleteMembershipType(id: number): Promise<void> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/membership-types/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Erro ao deletar membership: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Erro ao deletar membership:', error);
      throw error;
    }
  },
};

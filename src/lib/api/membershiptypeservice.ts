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
};

import { Race, RaceCreationRequest, RaceUpdateRequest } from '@/types/race.types';
import { getAuthToken } from '@/lib/auth';

const getApiBaseUrl = () => {
  // Garante que sempre terminamos com "/api" e evitamos duplicação
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

export const RaceService = {
  // Create a new race
  async createRace(data: RaceCreationRequest): Promise<Race> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/races`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Erro ao criar corrida: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      console.error('Erro ao criar corrida:', error);
      throw error;
    }
  },

  // Get all races
  async getAllRaces(): Promise<Race[]> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/races`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar corridas: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Erro ao buscar corridas:', error);
      throw error;
    }
  },

  // Get race by ID
  async getRaceById(id: number): Promise<Race> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/races/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Corrida não encontrada');
      }

      return response.json();
    } catch (error: any) {
      console.error('Erro ao buscar corrida:', error);
      throw error;
    }
  },

  // Update a race
  async updateRace(id: number, data: RaceUpdateRequest): Promise<Race> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/races/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Erro ao atualizar corrida: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      console.error('Erro ao atualizar corrida:', error);
      throw error;
    }
  },

  // Delete a race
  async deleteRace(id: number): Promise<void> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/races/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Erro ao deletar corrida: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Erro ao deletar corrida:', error);
      throw error;
    }
  },

  // Search races by name
  async searchRaces(name: string): Promise<Race[]> {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const response = await fetch(`${API_BASE_URL}/races/search?name=${encodeURIComponent(name)}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar corridas: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      console.error('Erro ao buscar corridas:', error);
      throw error;
    }
  },
};

import { apiRequest } from '@/lib/api-client';

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  active: boolean;
}

export interface BlogCategoryCreationDto {
  name: string;
  slug: string;
  description?: string;
}

export interface BlogCategoryUpdateDto {
  name?: string;
  description?: string;
  active?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const CATEGORIES_ENDPOINT = `${API_URL}/api/admin/blog-categories`;

export class CategoryService {
  static async getAllCategories(): Promise<BlogCategory[]> {
    const response = await apiRequest(CATEGORIES_ENDPOINT);
    if (!response.ok) {
      throw new Error('Erro ao buscar categorias');
    }
    return response.json();
  }

  static async getCategoryById(id: number): Promise<BlogCategory> {
    const response = await apiRequest(`${CATEGORIES_ENDPOINT}/${id}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar categoria ${id}`);
    }
    return response.json();
  }

  static async createCategory(dto: BlogCategoryCreationDto): Promise<BlogCategory> {
    const response = await apiRequest(CATEGORIES_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar categoria');
    }
    return response.json();
  }

  static async updateCategory(id: number, dto: BlogCategoryUpdateDto): Promise<BlogCategory> {
    const response = await apiRequest(`${CATEGORIES_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar categoria');
    }
    return response.json();
  }

  static async deleteCategory(id: number): Promise<void> {
    const response = await apiRequest(`${CATEGORIES_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar categoria');
    }
  }
}

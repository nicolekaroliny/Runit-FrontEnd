import { BlogPost, PaginatedResponse, BlogPostCreationDto, BlogPostUpdateDto } from '@/types/blog.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const BLOG_API = `${API_URL}/api/blog`;
const ADMIN_BLOG_API = `${API_URL}/api/admin/blog-posts`;

export class BlogService {
  /**
   * Busca posts publicados com paginação
   */
  static async getPublishedPosts(
    page: number = 0,
    size: number = 12
  ): Promise<PaginatedResponse<BlogPost>> {
    const response = await fetch(`${BLOG_API}/posts?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar posts: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Busca todos os posts (admin), incluindo rascunhos e revisões
   */
  static async getAllAdminPosts(): Promise<BlogPost[]> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

    const response = await fetch(ADMIN_BLOG_API, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ao buscar posts (admin): ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Busca um post específico pelo ID
   */
  static async getPostById(id: string | number): Promise<BlogPost> {
    const response = await fetch(`${BLOG_API}/posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Post não encontrado: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Busca posts por categoria
   */
  static async getPostsByCategory(
    categorySlug: string,
    page: number = 0,
    size: number = 12
  ): Promise<PaginatedResponse<BlogPost>> {
    const response = await fetch(
      `${BLOG_API}/posts/category/${categorySlug}?page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar posts da categoria: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Busca posts por termo de busca
   */
  static async searchPosts(query: string): Promise<BlogPost[]> {
    const response = await fetch(`${BLOG_API}/posts/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na busca: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Cria um novo post (requer autenticação ADMIN/EDITOR)
   */
  static async createPost(dto: BlogPostCreationDto): Promise<BlogPost> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(ADMIN_BLOG_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ao criar post: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Atualiza um post existente (requer autenticação ADMIN/EDITOR)
   */
  static async updatePost(id: number, dto: BlogPostUpdateDto): Promise<BlogPost> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${ADMIN_BLOG_API}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ao atualizar post: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Deleta um post (requer autenticação ADMIN/EDITOR)
   */
  static async deletePost(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${ADMIN_BLOG_API}/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar post: ${response.statusText}`);
    }
  }
}

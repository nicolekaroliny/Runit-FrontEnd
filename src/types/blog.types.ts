export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;  // frontend
  thumbnailUrl?: string;  // backend
  category?: string;
  categories?: any[];  // backend
  createdAt: string;
  slug: string;
  status?: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number?: number;  // current page number (backend)
  currentPage?: number;  // current page (custom)
  size?: number;  // page size (backend)
  pageSize?: number;  // page size (custom)
  last: boolean;
  first: boolean;
}

export interface BlogPostCreationDto {
  title: string;
  slug: string;
  excerpt: string;
  thumbnailUrl: string;
  content: string;
  authorId: number;
  categoryIds: number[];
  status?: 'DRAFT' | 'PUBLISHED' | 'PENDING_REVIEW' | 'ARCHIVED';
}

export interface BlogPostUpdateDto {
  title?: string;
  slug?: string;
  excerpt?: string;
  thumbnailUrl?: string;
  content?: string;
  categoryIds?: number[];
}

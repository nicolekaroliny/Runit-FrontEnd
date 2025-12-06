// User types from backend

export type UserRole = 'ADMIN' | 'EDITOR' | 'USER';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

// Response DTO from Backend
export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  userRole: UserRole;
  profilePictureUrl?: string;
  birthDate?: string; // ISO date string (YYYY-MM-DD)
  gender?: Gender;
  timezone?: string;
  locale?: string;
  totalRunningDistance: number;
  totalRunningTime: number;
  active: boolean;
  createdAt: string; // ISO timestamp
}

// Request DTO for Creation
export interface UserCreationRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: string;
  gender?: Gender;
  timezone?: string;
  locale?: string;
}

// Request DTO for Update (all fields optional)
export interface UserUpdateRequest {
  name?: string;
  lastName?: string;
  birthDate?: string;
  gender?: Gender;
  timezone?: string;
  locale?: string;
  profilePictureUrl?: string;
}

// Paginated Response (if backend returns pagination)
export interface PaginatedUserResponse {
  content: User[];
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

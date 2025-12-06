// User types from backend

export type UserRole = 'ADMIN' | 'EDITOR' | 'USER';
export type Gender = 'M' | 'F' | 'O';

// Membership Type
export interface MembershipType {
  id: number;
  name: string;
  monthlyPrice: number;
  description?: string;
  createdAt: string;
}

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
  membershipType?: MembershipType;
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

// Request DTO for Update (all fields optional, used by admin to change role/membership)
export interface UserUpdateRequest {
  name?: string;
  lastName?: string;
  birthDate?: string;
  gender?: Gender;
  timezone?: string;
  locale?: string;
  profilePictureUrl?: string;
  userRole?: UserRole;
  membershipTypeId?: number;
}

// Paginated Response (if backend returns pagination)
export interface PaginatedUserResponse {
  content: User[];
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

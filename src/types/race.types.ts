// Race Status Enum (do backend)
export type RaceStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELED';

// Response DTO from Backend
export interface Race {
  id: number;
  name: string;
  raceDate: string; // ISO date string (YYYY-MM-DD)
  registrationUrl?: string;
  organizerContact?: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  maxParticipants?: number;
  raceDistanceKm: number;
  status: RaceStatus;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  active: boolean;
}

// Request DTO for Creation
export interface RaceCreationRequest {
  name: string;
  raceDate: string;
  registrationUrl?: string;
  organizerContact?: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  maxParticipants?: number;
  raceDistanceKm: number;
  status: RaceStatus;
}

// Request DTO for Update (all fields optional)
export interface RaceUpdateRequest {
  name?: string;
  raceDate?: string;
  registrationUrl?: string;
  organizerContact?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  maxParticipants?: number;
  raceDistanceKm?: number;
  status?: RaceStatus;
}

// Paginated Response (if backend returns pagination)
export interface PaginatedRaceResponse {
  content: Race[];
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

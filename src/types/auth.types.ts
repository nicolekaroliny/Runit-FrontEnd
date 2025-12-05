/**
 * Verificação de Tipos TypeScript para Autenticação
 * 
 * Este arquivo documenta as interfaces e tipos utilizados
 * na autenticação do Runit Frontend.
 */

// ============================================
// TIPOS DO SERVIÇO DE AUTENTICAÇÃO
// ============================================

export type UserType = "user" | "admin";

export interface SignUpData {
  name: string;                      // Min 1, Max 100
  lastName: string;                  // Min 1, Max 150
  birthDate: string;                 // YYYY-MM-DD, no passado
  gender: 'M' | 'F';                 // Apenas M ou F
  timezone: string | null;           // Ex: America/Sao_Paulo
  locale: string | null;             // Ex: pt_BR
  email: string;                     // Email válido
  password: string;                  // Min 8 chars
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;                     // JWT
  id: number;
  name: string;
  lastName: string;
  email: string;
  birthDate?: string;
  gender?: 'M' | 'F';
  timezone?: string | null;
  locale?: string | null;
  role: string;                      // "USER" | "ADMIN"
}

export interface LoginResponse {
  token: string;
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: string;
}

// ============================================
// TIPOS DO CONTEXTO DE AUTENTICAÇÃO
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  user_type: UserType;
  phone?: string | null;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: SignUpData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// ============================================
// TIPOS DE RESULTADO
// ============================================

export interface PerformResult {
  success: boolean;
  user?: User;
  message?: string;
}

// ============================================
// EXEMPLOS DE USO
// ============================================

/**
 * Exemplo 1: Usar contexto em um componente
 */
/*
'use client';

import { useAuth } from '@/context/authcontext';

export function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();

  if (!user) {
    return <p>Não autenticado</p>;
  }

  return (
    <div>
      <p>Bem-vindo, {user.name}!</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
*/

/**
 * Exemplo 2: Usar authService diretamente
 */
/*
import { authService, SignUpData } from '@/lib/api/authservice';

const data: SignUpData = {
  name: "João",
  lastName: "Silva",
  email: "joao@example.com",
  password: "senha123",
  birthDate: "1990-01-15",
  gender: "M",
  timezone: "America/Sao_Paulo",
  locale: "pt_BR",
};

try {
  const response = await authService.signup(data);
  console.log('Sucesso!', response.token);
} catch (error) {
  console.error('Erro:', error.message);
}
*/

/**
 * Exemplo 3: Usar auth helpers
 */
/*
import { performLogin, performRegister, getCurrentUser } from '@/lib/auth';

// Login
const loginResult = await performLogin('joao@example.com', 'senha123');
if (loginResult.success) {
  console.log('Usuário:', loginResult.user);
}

// Registrar
const registerResult = await performRegister(signupData);

// Obter usuário armazenado
const user = getCurrentUser();
console.log('User from storage:', user);
*/

// ============================================
// MAPEAMENTO DE TIPOS
// ============================================

/**
 * Backend → Frontend
 * 
 * Backend SignUpResponse
 *   ↓ convertido para
 * Frontend AuthResponse
 *   ↓ transformado para
 * Frontend User (para armazenar)
 * 
 * Mapeamento:
 * - backend.role (string) → user.user_type (UserType)
 * - backend.id (number) → user.id (string)
 * - backend.name → user.name
 * - backend.email → user.email
 */

// ============================================
// VALIDAÇÕES
// ============================================

/**
 * Validações no Frontend
 */

export const validations = {
  // Nome: 1-100 chars
  name: (value: string) => value.length > 0 && value.length <= 100,

  // Sobrenome: 1-150 chars
  lastName: (value: string) => value.length > 0 && value.length <= 150,

  // Email: deve ser válido
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),

  // Senha: min 8 chars
  password: (value: string) => value.length >= 8,

  // Data de nascimento: deve ser no passado
  birthDate: (value: string) => new Date(value) < new Date(),

  // Gênero: M, F, ou O
  gender: (value: string) => ['M', 'F', 'O'].includes(value),

  // Timezone: max 50 chars
  timezone: (value: string | null) => !value || value.length <= 50,

  // Locale: max 10 chars
  locale: (value: string | null) => !value || value.length <= 10,
};

// ============================================
// ERROS ESPERADOS DO BACKEND
// ============================================

export const errorMessages = {
  // 400: Validação falhou
  validation: "Dados inválidos. Verifique todos os campos.",

  // 401: Credenciais inválidas
  unauthorized: "Email ou senha inválidos.",

  // 409: Email já cadastrado
  conflict: "Este email já está cadastrado.",

  // 500: Erro do servidor
  server: "Erro do servidor. Tente novamente.",

  // Network: Não conseguiu conectar
  network: "Não foi possível conectar ao servidor.",
};

// ============================================
// STATUS HTTP
// ============================================

export const httpStatus = {
  // 200: OK
  ok: 200,

  // 400: Bad Request (validação)
  badRequest: 400,

  // 401: Unauthorized (credenciais)
  unauthorized: 401,

  // 409: Conflict (email duplicado)
  conflict: 409,

  // 500: Internal Server Error
  serverError: 500,
};

// ============================================
// ENDPOINTS
// ============================================

export const endpoints = {
  register: "/auth/register",      // POST
  login: "/auth/login",            // POST
  refreshToken: "/auth/refresh",   // POST (futuro)
  logout: "/auth/logout",          // POST (futuro)
  me: "/auth/me",                  // GET (futuro)
};

// ============================================
// LOCALIZAÇÃO (LOCALE)
// ============================================

export const locales = {
  ptBR: "pt_BR",
  ptPT: "pt_PT",
  enUS: "en_US",
  enGB: "en_GB",
  esES: "es_ES",
  esMX: "es_MX",
  frFR: "fr_FR",
  deDE: "de_DE",
  itIT: "it_IT",
  jaJP: "ja_JP",
  zhCN: "zh_CN",
};

// ============================================
// TIMEZONES
// ============================================

export const timezones = {
  // Brasil
  saoPaulo: "America/Sao_Paulo",
  manaus: "America/Manaus",
  recife: "America/Recife",
  rioBranco: "America/Rio_Branco",
  noronha: "America/Noronha",

  // USA
  newYork: "America/New_York",
  losAngeles: "America/Los_Angeles",
  chicago: "America/Chicago",

  // Europa
  london: "Europe/London",
  paris: "Europe/Paris",
  berlin: "Europe/Berlin",

  // Ásia
  tokyo: "Asia/Tokyo",
  shanghai: "Asia/Shanghai",

  // Oceania
  sydney: "Australia/Sydney",
};

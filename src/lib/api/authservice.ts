export type UserType = "user" | "admin";

const API_BASE_URL = "http://localhost:8080/api"; 

/**
 * Interface de dados para Cadastro (SignUpData).
 * Contém todos os campos necessários para o endpoint /auth/register.
 */
export interface SignUpData {
  email: string;
  password: string;
  name: string;
  lastName: string;
  birthDate: string; 
  gender: 'M' | 'F' | 'O'; 
  timezone: string; 
  locale: string;   
  user_type: UserType;
}

/**
 * Interface de dados para Login (SignInData).
 */
export interface SignInData {
  email: string;
  password: string;
}

/**
 * Interface para a resposta de sucesso de Autenticação (AuthResponse).
 * Inclui o token JWT e o objeto 'user' completo.
 */
export interface AuthResponse {
  jwtToken: string; 
  user: {
    id: string;
    name: string;
    email: string;
    user_type: UserType;
    lastName: string;
    birthDate: string;
    gender: 'M' | 'F' | 'O';
    timezone: string;
    locale: string;
  };
}

export const authService = {
  
  /**
   * Função para REGISTRAR um novo usuário.
   */
  async signup(data: SignUpData): Promise<AuthResponse> {
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ao cadastrar. Status: ${response.status}.`);
    }

    const result: AuthResponse = await response.json();
    return result;
  },

  /**
   * Função para LOGIN do usuário.
   */
  async signin(data: SignInData): Promise<AuthResponse> {
  
    const response = await fetch(`${API_BASE_URL}/auth/login`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Credenciais inválidas.");
    }

    const result: AuthResponse = await response.json();
    return result;
  },
};
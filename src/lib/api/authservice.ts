export type UserType = "user" | "admin";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api`; 

/**
 * Interface de dados para Cadastro (SignUpData).
 * Contém todos os campos necessários para o endpoint /auth/register.
 */
export interface SignUpData {
  name: string;                      // OBRIGATÓRIO: Min 1, Max 100 chars
  lastName: string;                  // OBRIGATÓRIO: Min 1, Max 150 chars
  birthDate: string;                 // OBRIGATÓRIO: Formato YYYY-MM-DD, deve ser no passado
  gender: 'M' | 'F';                 // OBRIGATÓRIO: Apenas M ou F
  timezone: string | null;           // OPCIONAL: Max 50 chars (ex: "America/Sao_Paulo")
  locale: string | null;             // OPCIONAL: Max 10 chars (ex: "pt_BR")
  email: string;                     // OBRIGATÓRIO: Deve ser email válido
  password: string;                  // OBRIGATÓRIO: Min 8 chars
  profilePictureUrl?: string | null; // OPCIONAL: Max 500 chars (URL da imagem) - não enviado ainda
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
 * O backend retorna os dados do usuário diretamente no root + token.
 */
export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  lastName: string;
  email: string;
  birthDate?: string;
  gender?: 'M' | 'F';
  timezone?: string | null;
  locale?: string | null;
  profilePictureUrl?: string | null;
  role: string; // "USER" ou "ADMIN"
}

/**
 * Interface específica para LoginResponse (conforme backend).
 * Login retorna apenas token, id, name, lastName, email e role.
 */
export interface LoginResponse {
  token: string;
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: string; // "USER" ou "ADMIN"
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
  async signin(data: SignInData): Promise<LoginResponse> {
    try {
      console.log("🔍 Tentando login para:", data.email);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, { 
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("🔍 Status HTTP:", response.status, response.statusText);
      console.log("🔍 Content-Type:", response.headers.get("content-type"));

      if (!response.ok) {
        let errorMessage = "Email ou senha inválidos";
        try {
          const errorData = await response.json();
          console.error("❌ Erro do servidor:", errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("❌ Não foi possível parsear erro:", e);
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error(`Servidor retornou Content-Type inválido: ${contentType}`);
      }

      const result: LoginResponse = await response.json();
      console.log("✅ Login OK! Dados recebidos:", {
        temToken: !!result.token,
        temId: !!result.id,
        email: result.email,
        role: result.role
      });
      
      return result;
      
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("❌ Erro de rede - Backend não está acessível");
        throw new Error("Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080");
      }
      throw error;
    }
  },
};
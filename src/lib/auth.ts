// Importa o serviço de autenticação e os tipos necessários dele
import { authService } from '@/lib/api/authservice';
import type { UserType as AuthServiceUserType, SignUpData as AuthServiceSignUpData } from '@/lib/api/authservice';


// Tipos que o resto do seu aplicativo vai usar para o usuário logado
export type User = {
  id: string;
  name: string;
  email: string;
  user_type: AuthServiceUserType; // Usa o UserType do authService para consistência
  phone?: string | null; // Permite null para consistência com o backend e AuthResponse
};

// --- Funções de Armazenamento/Recuperação de Sessão ---

function storeSession(accessToken: string, user: User) {
  localStorage.setItem('token', accessToken);
  localStorage.setItem('currentUser', JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
}

export function getCurrentUser(): User | null {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error("Failed to parse user from localStorage:", e);
    localStorage.removeItem('currentUser');
    return null;
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

// --- Funções que utilizam o authService para login e registro ---

export async function performLogin(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    const response = await authService.signin({ email, password });
    if (response.access_token && response.user) {
      // Ajusta o tipo do user para o tipo local se houver diferença, caso contrário, usa direto
      const userToStore: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        user_type: response.user.user_type,
      };
      storeSession(response.access_token, userToStore);
      return { success: true, user: userToStore };
    }
    return { success: false, message: "Resposta de login incompleta." };
  } catch (error: any) { // Use any para lidar com 'error.message'
    console.error("Login failed:", error.message);
    logoutUser();
    return { success: false, message: error.message || 'Erro de rede ou servidor.' };
  }
}

// Adapta a função de registro para usar o `authService` e o tipo de retorno correto
export async function performRegister(data: AuthServiceSignUpData): Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    const response = await authService.signup(data);
    if (response.access_token && response.user) {
      const userToStore: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        user_type: response.user.user_type,
      };
      storeSession(response.access_token, userToStore);
      return { success: true, user: userToStore };
    }
    return { success: false, message: "Resposta de registro incompleta." };
  } catch (error: any) { // Use any para lidar com 'error.message'
    console.error("Registration failed:", error.message);
    return { success: false, message: error.message || 'Erro de rede ou servidor.' };
  }
}

// Re-exporta UserType para ser usado por outros componentes que precisam saber os tipos de usuário
export type { AuthServiceUserType as UserType };
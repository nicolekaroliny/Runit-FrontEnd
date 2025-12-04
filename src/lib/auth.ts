
import { authService } from '@/lib/api/authservice';
import type { UserType as AuthServiceUserType, SignUpData as AuthServiceSignUpData } from '@/lib/api/authservice';



export type User = {
  id: string;
  name: string;
  email: string;
  user_type: AuthServiceUserType; 
  phone?: string | null; 
};




function storeSession(jwtToken: string, user: User) {
  localStorage.setItem('token', jwtToken); 
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



export async function performLogin(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    const response = await authService.signin({ email, password });
    
    if (response.token && response.id) {
      const userToStore: User = {
        id: response.id.toString(),
        name: response.name,
        email: response.email,
        user_type: response.role.toLowerCase() as AuthServiceUserType,
      };
     
      storeSession(response.token, userToStore); 
      return { success: true, user: userToStore };
    }
    return { success: false, message: "Resposta de login incompleta." };
  } catch (error: unknown) { 
    const message = error instanceof Error ? error.message : 'Erro de rede ou servidor.';
    console.error("Login failed:", message);
    logoutUser();
    return { success: false, message };
  }
}


export async function performRegister(data: AuthServiceSignUpData): Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    const response = await authService.signup(data);
    
    if (response.token && response.id) {
      const userToStore: User = {
        id: response.id.toString(),
        name: response.name,
        email: response.email,
        user_type: response.role.toLowerCase() as AuthServiceUserType,
      };
      
      storeSession(response.token, userToStore);
      return { success: true, user: userToStore };
    }
    return { success: false, message: "Resposta de registro incompleta." };
  } catch (error: unknown) { 
    const message = error instanceof Error ? error.message : 'Erro de rede ou servidor.';
    console.error("Registration failed:", message);
    return { success: false, message };
  }
}


export type { AuthServiceUserType as UserType };
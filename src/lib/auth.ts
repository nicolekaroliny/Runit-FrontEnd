
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
    
    if (response.jwtToken && response.user) {
      
      const userToStore: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        user_type: response.user.user_type,
      };
     
      storeSession(response.jwtToken, userToStore); 
      return { success: true, user: userToStore };
    }
    return { success: false, message: "Resposta de login incompleta." };
  } catch (error: any) { 
    console.error("Login failed:", error.message);
    logoutUser();
    return { success: false, message: error.message || 'Erro de rede ou servidor.' };
  }
}


export async function performRegister(data: AuthServiceSignUpData): Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    const response = await authService.signup(data);
    
    if (response.jwtToken && response.user) {
      const userToStore: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        user_type: response.user.user_type,
      };
      
      storeSession(response.jwtToken, userToStore);
      return { success: true, user: userToStore };
    }
    return { success: false, message: "Resposta de registro incompleta." };
  } catch (error: any) { 
    console.error("Registration failed:", error.message);
    return { success: false, message: error.message || 'Erro de rede ou servidor.' };
  }
}


export type { AuthServiceUserType as UserType };

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
  try {
    // Armazenar em localStorage (para acesso cliente)
    localStorage.setItem('token', jwtToken);
    console.log("✅ Token armazenado em localStorage");
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log("✅ User armazenado em localStorage:", user);

    // Também armazenar em cookie (para middleware do servidor verificar)
    // O cookie será lido pelo middleware para proteger rotas
    document.cookie = `token=${jwtToken}; path=/; max-age=${24 * 60 * 60}`;
    console.log("✅ Token também salvo em cookie para middleware");
  } catch (error) {
    console.error("❌ Erro ao armazenar session:", error);
    throw error;
  }
}

export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  // Remover cookie também
  document.cookie = 'token=; path=/; max-age=0';
  console.log("✅ Logout completo - localStorage e cookie limpos");
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
    console.log("🔐 performLogin: Iniciando login para", email);
    const response = await authService.signin({ email, password });
    console.log("🔐 performLogin: Resposta recebida:", { token: response.token ? "✓" : "✗", id: response.id, name: response.name, email: response.email, role: response.role });
    
    if (response.token && response.id) {
      const userToStore: User = {
        id: response.id.toString(),
        name: response.name,
        email: response.email,
        user_type: response.role.toLowerCase() as AuthServiceUserType,
      };
      console.log("🔐 performLogin: User object criado:", userToStore);
     
      storeSession(response.token, userToStore);
      console.log("🔐 performLogin: Session armazenada com sucesso");
      return { success: true, user: userToStore };
    }
    console.error("❌ performLogin: Resposta incompleta");
    return { success: false, message: "Resposta de login incompleta." };
  } catch (error: unknown) { 
    const message = error instanceof Error ? error.message : 'Erro de rede ou servidor.';
    console.error("❌ performLogin: Erro capturado:", message);
    logoutUser();
    return { success: false, message };
  }
}


export async function performRegister(data: AuthServiceSignUpData): Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    console.log("📝 performRegister: Iniciando registro");
    const response = await authService.signup(data);
    console.log("📝 performRegister: Resposta recebida:", { token: response.token ? "✓" : "✗", id: response.id, name: response.name, email: response.email, role: response.role });
    
    if (response.token && response.id) {
      const userToStore: User = {
        id: response.id.toString(),
        name: response.name,
        email: response.email,
        user_type: response.role.toLowerCase() as AuthServiceUserType,
      };
      
      console.log("📝 performRegister: User object criado:", userToStore);
      storeSession(response.token, userToStore);
      console.log("📝 performRegister: Session armazenada com sucesso");
      return { success: true, user: userToStore };
    }
    console.error("❌ performRegister: Resposta incompleta");
    return { success: false, message: "Resposta de registro incompleta." };
  } catch (error: unknown) { 
    const message = error instanceof Error ? error.message : 'Erro de rede ou servidor.';
    console.error("❌ performRegister: Erro capturado:", message);
    logoutUser();
    return { success: false, message };
  }
}


export type { AuthServiceUserType as UserType };
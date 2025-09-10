'use client'; // Necessário para componentes no App Router que usam hooks

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  performLogin,
  performRegister,
  logoutUser,
  getCurrentUser,
  User, // Importa o tipo User do '@/lib/auth'
  UserType // Importa o tipo UserType do '@/lib/auth'
} from '../lib/auth';

// Define a interface para o que o contexto de autenticação irá fornecer
interface AuthContextType {
  user: User | null; // O objeto do usuário logado ou null
  isAuthenticated: boolean; // Indica se há um usuário autenticado
  login: (email: string, password: string) => Promise<void>; // Função para login
  register: (data: { name: string; email: string; password: string; user_type: UserType; phone?: string; }) => Promise<void>; // Função para registro
  logout: () => void; // Função para logout
  isLoading: boolean; // Indica se o estado de autenticação está sendo carregado (ex: do localStorage)
}

// Cria o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do contexto de autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa como true para indicar carregamento inicial

  // Efeito para carregar o usuário do localStorage ao montar o componente
  useEffect(() => {
    const loadUserFromLocalStorage = async () => {
      setIsLoading(true);
      try {
        const storedUser = getCurrentUser(); // Tenta recuperar o usuário do localStorage
        if (storedUser) {
          setUser(storedUser); // Define o usuário se encontrado
        }
      } catch (error) {
        console.error("Erro ao carregar usuário do localStorage:", error);
        logoutUser(); // Limpa se houver erro ao parsear
        setUser(null);
      } finally {
        setIsLoading(false); // Termina o carregamento
      }
    };

    loadUserFromLocalStorage();
  }, []); // Executa apenas uma vez no carregamento

  // Função para lidar com o login
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true); // Inicia loading
    try {
      const result = await performLogin(email, password); // Chama a função de login de '@/lib/auth'
      if (result.success && result.user) {
        setUser(result.user); // Atualiza o estado do usuário
      } else {
        // Se a operação não for um sucesso, mas não lançou erro (ex: mensagem do backend)
        console.error("Login falhou:", result.message);
        setUser(null); // Garante que o usuário não esteja logado
        throw new Error(result.message || "Login falhou"); // Lança erro para o componente lidar
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      setUser(null); // Em caso de erro, remove o usuário
      throw error; // Re-lança o erro para o componente que chamou
    } finally {
      setIsLoading(false); // Finaliza loading
    }
  }, []);

  // Função para lidar com o registro
  const register = useCallback(async (data: { name: string; email: string; password: string; user_type: UserType; phone?: string; }) => {
    setIsLoading(true); // Inicia loading
    try {
      const result = await performRegister(data); // Chama a função de registro de '@/lib/auth'
      if (result.success && result.user) {
        setUser(result.user); // Atualiza o estado do usuário (se o registro logar automaticamente)
      } else {
        console.error("Registro falhou:", result.message);
        setUser(null);
        throw new Error(result.message || "Registro falhou");
      }
    } catch (error: any) {
      console.error("Erro no registro:", error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função para lidar com o logout
  const logout = useCallback(() => {
    logoutUser(); // Limpa o localStorage
    setUser(null); // Remove o usuário do estado
    // Opcional: router.push('/signin'); para redirecionar após logout
  }, []);

  const isAuthenticated = !!user; // Deriva o estado de autenticação

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
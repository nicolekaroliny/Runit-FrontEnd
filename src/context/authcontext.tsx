'use client'; 

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  performLogin,
  performRegister,
  logoutUser,
  getCurrentUser,
  getAuthToken,
  User
} from '../lib/auth';
import type { SignUpData } from '../lib/api/authservice';

interface AuthContextType {
  user: User | null; 
  isAuthenticated: boolean; 
  login: (email: string, password: string) => Promise<void>; 
  register: (data: SignUpData) => Promise<void>; 
  logout: () => void; 
  isLoading: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const loadUserFromLocalStorage = async () => {
      setIsLoading(true); 
      try {
        const storedUser = getCurrentUser();
        const token = getAuthToken();
        console.log("📦 User do localStorage:", storedUser);
        console.log("📦 Token exists:", !!token);
        if (storedUser && token) {
          console.log("✅ Usuário e token carregados do localStorage");
          setUser(storedUser); 
        } else if (storedUser || token) {
          console.warn("⚠️ Dados inconsistentes no localStorage - limpando");
          logoutUser();
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar usuário do localStorage:", error);
        logoutUser(); 
        setUser(null);
      } finally {
        setIsLoading(false); 
      }
    };

    loadUserFromLocalStorage();
  }, []); 

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true); 
    try {
      const result = await performLogin(email, password); 
      console.log("🔐 Login result:", result);
      
      if (result.success && result.user) {
        console.log("✅ Login bem-sucedido! User:", result.user);
        setUser(result.user);
        const token = getAuthToken();
        console.log("✅ Token persistido em localStorage:", !!token);
      } else {
        console.error("❌ Login falhou:", result.message);
        setUser(null); 
        throw new Error(result.message || "Login falhou"); 
      }
    } catch (error: unknown) {
      console.error("❌ Erro no login:", error);
      setUser(null); 
      throw error; 
    } finally {
      setIsLoading(false); 
    }
  }, []);

  const register = useCallback(async (data: SignUpData) => {
    setIsLoading(true); 
    try {
      console.log("📝 Iniciando registro do usuário");
      const result = await performRegister(data); 
      console.log("📝 Resultado do registro:", result);
      if (result.success && result.user) {
        console.log("✅ Registro bem-sucedido! User:", result.user);
        setUser(result.user);
        const token = getAuthToken();
        console.log("✅ Token persistido em localStorage:", !!token);
      } else {
        console.error("❌ Registro falhou:", result.message);
        setUser(null);
        throw new Error(result.message || "Registro falhou");
      }
    } catch (error) {
      console.error("❌ Erro no registro:", error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    console.log("🔴 Iniciando logout");
    logoutUser();
    setUser(null);
    console.log("✅ Logout completo - localStorage limpado");
  }, []);

  const isAuthenticated = !!user; 

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

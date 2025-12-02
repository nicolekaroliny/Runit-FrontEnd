'use client'; 

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  performLogin,
  performRegister,
  logoutUser,
  getCurrentUser,
  User,
  UserType
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
          if (storedUser) {
          setUser(storedUser); 
          }
     } catch (error) {
        console.error("Erro ao carregar usuário do localStorage:", error);
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
      if (result.success && result.user) {
        setUser(result.user); 
      } else {
        console.error("Login falhou:", result.message);
        setUser(null); 
        throw new Error(result.message || "Login falhou"); 
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      setUser(null); 
      throw error; 
    } finally {
      setIsLoading(false); 
    }
  }, []);

 
  const register = useCallback(async (data: SignUpData) => {
    setIsLoading(true); 
    try {
      const result = await performRegister(data); 
      if (result.success && result.user) {
        setUser(result.user); 
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

  
  const logout = useCallback(() => {
    logoutUser(); 
    setUser(null); 
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
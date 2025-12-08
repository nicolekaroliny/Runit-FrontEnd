'use client';

import { LoginForm } from '@/ui/loginform';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import LogoNav from '@/app/components/navBar/LogoNav';
import { authService } from '@/lib/api/authservice';

export default function SignIn() {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingBiometric, setIsLoadingBiometric] = useState(false);
  const [errorGoogle, setErrorGoogle] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    setErrorGoogle(null);
    try {
      console.log('🔄 Iniciando login com Google...');
      const googleAuthUrl = await authService.getGoogleAuthUrl();
      console.log('✅ URL do Google obtida, redirecionando...');
      // Redireciona para o Google OAuth
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error('❌ Erro no login com Google:', error);
      setErrorGoogle(error instanceof Error ? error.message : 'Erro ao iniciar login com Google');
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoadingBiometric(true);
    try {
      // TODO: Implementar WebAuthn/Biometric API
      if (window.PublicKeyCredential) {
        console.log('Biometric login initiated');
        // Aqui você implementaria a chamada à WebAuthn API
      } else {
        alert('Seu navegador não suporta autenticação biométrica');
      }
    } catch (error) {
      console.error('Biometric login failed:', error);
    } finally {
      setIsLoadingBiometric(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden bg-card">

        {/* Painel Esquerdo - Branding */}
        <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-4 lg:p-6 bg-navbar-primary">
          
          {/* Logo RUNIT */}
          <div className="bg-transparent w-40 h-14 rounded-lg flex items-center justify-center mb-4">
            <div className="relative w-32 h-10">
              <LogoNav/>
            </div>
          </div>

          {/* Runner Animation */}
          <div className="relative w-32 h-32 mb-4 animate-wiggle">
            <Image
              src="/images/runner2.png"
              alt="Pessoa correndo na linha de chegada"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Slogan */}
          <p className="text-base font-bold text-navbar-foreground text-center mb-2">
            Continue sua jornada!
          </p>
          <p className="text-xs text-navbar-foreground/80 text-center px-4">
            Acompanhe seu progresso e alcance seus objetivos de corrida.
          </p>

          {/* Não tem conta? */}
          <div className="mt-4 text-center">
            <p className="text-navbar-foreground text-sm">
              Não tem uma conta?{' '}
              <Link href="/signup" className="font-bold text-secondary hover:text-secondary/80 transition-colors">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        {/* Painel Direito - Formulário */}
        <div className="w-full lg:w-3/5 p-4 lg:p-6 bg-card">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Bem-vindo de volta</h1>
              <p className="text-muted-foreground">Faça login para continuar</p>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* Erro do Google */}
            {errorGoogle && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {errorGoogle}
              </div>
            )}

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t bg-muted-foreground border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Ou continue com</span>
              </div>
            </div>

            {/* Botões de Login Alternativos */}
            <div className="grid grid-cols-2 gap-4">
              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoadingGoogle}
                className="flex items-center bg-background justify-center gap-2 px-4 py-3 border-b-4 border-border rounded-lg hover:bg-secondary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className={`font-semibold text-foreground ${isLoadingGoogle ? 'opacity-50' : ''}`}>
                  {isLoadingGoogle ? 'Carregando...' : 'Google'}
                </span>
              </button>

              {/* Biometric Login */}
              <button
                onClick={handleBiometricLogin}
                disabled={isLoadingBiometric}
                className="flex items-center bg-background justify-center gap-2 px-4 py-3 border-b-4 border-border rounded-lg hover:bg-secondary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`font-semibold text-foreground ${isLoadingBiometric ? 'opacity-50' : ''}`}>
                  {isLoadingBiometric ? 'Verificando...' : 'Biometria'}
                </span>
              </button>
            </div>

            {/* Links úteis */}
            <div className="flex items-center justify-between text-sm">
              <Link href="/forgot-password" className="text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

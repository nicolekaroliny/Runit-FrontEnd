'use client';

import { SignupForm } from '@/ui/signupform';
import Link from 'next/link';
import Image from 'next/image';
import LogoNav from '@/app/components/navBar/LogoNav';

export default function SignUp() {
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
            Comece sua jornada!
          </p>
          <p className="text-xs text-navbar-foreground/80 text-center px-4">
            Junte-se a milhares de corredores e acompanhe seu progresso até a linha de chegada.
          </p>

          {/* Já tem conta? */}
          <div className="mt-4 text-center">
            <p className="text-navbar-foreground text-sm">
              Já tem uma conta?{' '}
              <Link href="/signin" className="font-bold text-secondary hover:text-secondary/80 transition-colors">
                Faça login
              </Link>
            </p>
          </div>
        </div>

        {/* Painel Direito - Formulário */}
        <div className="w-full lg:w-3/5 p-4 lg:p-6 bg-card">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Crie sua conta</h1>
              <p className="text-sm text-muted-foreground">Junte-se à comunidade Runit</p>
            </div>

            {/* Signup Form */}
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
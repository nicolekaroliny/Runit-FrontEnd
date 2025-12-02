'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Lógica de login
    console.log('Email:', email, 'Password:', password);

    // Redirecionar — após login
    router.push('/corridas');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white py-12 px-4 sm:px-6 lg:px-8">

      {/* Painel da logo*/}
      <div className="bg-[#1E5AA8] w-48 h-16 rounded-md flex items-center justify-center shadow-md mb-10 mt-4">
        <div className="relative w-40 h-12">
          <Image
            src="/images/logo.png"
            alt="Logo RUNIT"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </div>

      {/* Painel principal de login */}
      <div className="max-w-md w-full bg-[#1E5AA8] p-10 rounded-2xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-white mb-6">
          Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-5">

            {/* Campo Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-white mb-1"
              >
                Digite seu e-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-3 py-3 bg-white border border-gray-300 
                           placeholder-gray-500 text-gray-900 rounded-lg 
                           focus:outline-none focus:ring-[#1E5AA8] focus:border-[#1E5AA8] 
                           sm:text-sm"
                placeholder="Digite seu e-mail."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-white mb-1"
              >
                Digite sua senha
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-3 py-3 bg-white border border-gray-300 
                           placeholder-gray-500 text-gray-900 rounded-lg 
                           focus:outline-none focus:ring-[#1E5AA8] focus:border-[#1E5AA8] 
                           sm:text-sm"
                placeholder="Digite sua senha."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Botão Entrar*/}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg 
                       text-white bg-[#003B99] hover:bg-[#002f7a] transition-colors duration-200"
          >
            Entrar
          </button>

          {/* Link Cadastro */}
          <div className="text-center mt-4">
            <span className="text-sm text-white">
              Não possuo uma conta{' '}
              <Link
                href="/signup"
                className="font-medium text-[#20017B] hover:text-[#3a02c0]"
              >
                Cadastro
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

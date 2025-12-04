'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Lógica de cadastro
    console.log('Nome:', name, 'Email:', email, 'Password:', password, 'ConfirmPassword:', confirmPassword);

    // Redirecionar somente aqui — após cadastro
    router.push('/signin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row w-full max-w-3xl rounded-2xl shadow-lg overflow-hidden">

        {/* Painel Esquerdo */}
        <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-4 md:p-5 bg-white">

          {/* Logo RUNIT */}
          <div className="bg-[#1E5AA8] w-48 h-16 rounded-md flex items-center justify-center mb-4 shadow-md mt-[-20px] mb-6">
            <div className="relative w-36 h-12">
              <Image
                src="/images/logo.png"
                alt="Logo RUNIT"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>

          {/* Runner */}
          <div className="relative w-40 h-40 md:w-44 md:h-44 mb-6 animate-pulse">
            <Image
              src="/runner.png"
              alt="Pessoa correndo na linha de chegada"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Texto */}
          <p className="text-sm md:text-base font-semibold text-[#1E5AA8] text-center px-2 mt-2">
            Comece sua jornada até a linha de chegada!
          </p>
        </div>

        {/* Painel Direito */}
        <div className="w-full md:w-3/5 bg-[#1E5AA8] p-6 md:p-7 flex flex-col justify-center">
          <div className="mb-5">
            <h2 className="text-center text-2xl md:text-2xl font-extrabold text-white">
              Cadastro
            </h2>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                Nome Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">
                Confirme sua senha!
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Digite sua senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="w-40 mx-auto block py-3 bg-[#003B99] text-white rounded-xl shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:bg-[#002F7A] transition"
              >
                Cadastre-se
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="text-sm text-white">
                Já possuo uma conta{' '}
                <Link href="/signin" className="font-medium text-[#20017B] hover:text-indigo-400">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
    
  );
}
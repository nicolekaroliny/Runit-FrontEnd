'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SignUp() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica de cadastro
    console.log('Nome:', name, 'Email:', email, 'Password:', password, 'ConfirmPassword:', confirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"> 
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"> 
        
        {/* Painel Superior: Imagem e Mensagem*/}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-8 bg-white order-2 md:order-1">
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-4 md:mb-6">
            <Image
              src="/runner.png" 
              alt="Pessoa correndo na linha de chegada"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <p className="text-lg md:text-xl font-bold text-gray-800 text-center">
            Comece sua jornada até a linha de chegada!
          </p>
        </div>

        {/* Painel Inferior/Formulário*/}
        <div className="w-full md:w-1/2 p-6 md:p-10 bg-[#20017B] flex flex-col justify-center order-1 md:order-2">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold text-white mb-6">
            Cadastro
          </h2>
          
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
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
                className="appearance-none relative block w-full px-3 py-3 bg-white border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="appearance-none relative block w-full px-3 py-3 bg-white border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="appearance-none relative block w-full px-3 py-3 bg-white border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="appearance-none relative block w-full px-3 py-3 bg-white border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Digite sua senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Cadastre-se
              </button>
            </div>

            <div className="text-center mt-4">
              <span className="text-sm text-white">
                Já possuo uma conta{' '}
                <Link href="/signin" className="font-medium text-indigo-300 hover:text-indigo-200">
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
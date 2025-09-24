"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";

export default function CorridasPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet" />
        <style>{`body, h1, h2, h3, h4, h5, h6, p, a, span, label, input, button, div { font-family: 'Poppins', sans-serif !important; font-weight: 700 !important; }`}</style>
      </Head>
      <div className="min-h-screen bg-white flex flex-col p-0">
        {/* Header */}
        <header className="w-full relative py-6 h-24 flex items-center rounded-b-3xl z-50" style={{ background: '#1E5AA8', color: '#fff' }}>
          <div className="w-full flex items-center justify-between px-8">
            <div className="flex items-center gap-6 h-full">
              <Image src="/images/logo.png" alt="Logo do Projeto" width={120} height={40} className="self-center" />
              <form
                className="flex items-center bg-white rounded-full shadow px-3 py-1 w-56 md:w-72 self-center mr-2"
                tabIndex={0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#20017B" strokeWidth="2" className="w-5 h-5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#20017B" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="bg-transparent outline-none text-gray-700 text-sm ml-2 flex-1 block"
                  style={{ minWidth: '120px' }}
                />
              </form>
            </div>
            <nav className="flex gap-8 items-center text-2xl font-bold">
              <nav className="flex gap-8 items-center text-2xl font-bold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <a
                  href="/"
                  className={`hover:underline px-2 py-1 rounded transition-colors duration-200 font-extrabold ${pathname === '/' ? 'bg-white text-[#20017B] shadow' : 'text-white'}`}
                >
                  Home
                </a>
                <a
                  href="/corridas"
                  className={`hover:underline px-2 py-1 rounded transition-colors duration-200 font-extrabold ${pathname === '/corridas' ? 'bg-white text-[#20017B] shadow' : 'text-white'}`}
                >
                  Corridas
                </a>
              </nav>
            </nav>
            <div className="flex items-center gap-6">
              <a href="/signin" title="Perfil" className="hover:ring-indigo-300">
                <span className="flex items-center">
                  <span className="mr-3 text-white text-lg font-bold">Bem-vindo, usuário!</span>
                  <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#3b82f6" className="w-6 h-6">
                      <circle cx="12" cy="10" r="3" stroke="#3b82f6" strokeWidth="2" />
                      <path stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18c0-2.21 3.58-4 6-4s6 1.79 6 4" />
                    </svg>
                  </span>
                </span>
              </a>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
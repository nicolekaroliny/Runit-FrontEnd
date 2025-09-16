"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function CorridasPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white flex flex-col p-0">
      {/* Header */}
      <header className="w-full relative py-6 h-24 flex items-center rounded-b-3xl" style={{ background: '#20017B', color: '#fff' }}>
        <div className="w-full flex items-center justify-between px-8">
          <div className="flex items-center gap-2 pt-8">
            <Image src="/images/logo.png" alt="Logo do Projeto" width={120} height={40} />
          </div>
          <nav className="flex gap-8 items-center text-2xl font-bold">
            <a
              href="/"
              className={`hover:underline px-2 py-1 rounded transition-colors duration-200 font-serif font-extrabold ${pathname === '/' ? 'bg-white text-[#20017B] shadow' : 'text-white'}`}
            >
              Home
            </a>
            <a
              href="/corridas"
              className={`hover:underline px-2 py-1 rounded transition-colors duration-200 font-serif font-extrabold ${pathname === '/corridas' ? 'bg-white text-[#20017B] shadow' : 'text-white'}`}
            >
              Corridas
            </a>
            <a
              href="/sobre-nos"
              className={`hover:underline px-2 py-1 rounded transition-colors duration-200 font-serif font-extrabold ${pathname === '/sobre-nos' ? 'bg-white text-[#20017B] shadow' : 'text-white'}`}
            >
              Sobre Nós
            </a>
            <a
              href="#contato"
              className={`hover:underline px-2 py-1 rounded transition-colors duration-200 font-serif font-extrabold ${pathname === '#contato' ? 'bg-white text-[#20017B] shadow' : 'text-white'}`}
            >
              Contato
            </a>
          </nav>
          <div className="flex items-center gap-6">
            <form
              className={`flex items-center bg-white rounded-full shadow px-3 py-1 mr-2 transition-all duration-300 overflow-hidden ${searchOpen ? 'w-56 md:w-72' : 'w-10 cursor-pointer'}`}
              onClick={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
              tabIndex={0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#20017B" strokeWidth="2" className="w-5 h-5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#20017B" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Pesquisar..."
                className={`bg-transparent outline-none text-gray-700 text-sm ml-2 flex-1 ${searchOpen ? 'block' : 'hidden'}`}
                style={{ minWidth: searchOpen ? '120px' : '0' }}
                onBlur={() => setSearchOpen(false)}
                onFocus={() => setSearchOpen(true)}
              />
            </form>
            <a href="/favoritos" title="Favoritos" className="hover:ring-indigo-300">
              <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                <span className="flex items-center justify-center w-full h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.172 5.172a4.5 4.5 0 0 1 6.364 0L12 7.636l2.464-2.464a4.5 4.5 0 1 1 6.364 6.364L12 21.364l-8.828-8.828a4.5 4.5 0 0 1 0-6.364z" />
                  </svg>
                </span>
              </span>
            </a>
            <a href="/signin" title="Perfil" className="hover:ring-indigo-300">
              <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#3b82f6" className="w-6 h-6">
                  <circle cx="12" cy="10" r="3" stroke="#3b82f6" strokeWidth="2" />
                  <path stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18c0-2.21 3.58-4 6-4s6 1.79 6 4" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}
"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Link from "next/link";

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
        <header className="w-full relative py-6 h-24 flex items-center rounded-b-3xl z-50" style={{ background: '#1E5AA8', color: '#fff' }}>
          <div className="w-full flex items-center justify-between px-8">
            <div className="flex items-center gap-6 h-full">
              <Image src="/images/logo.png" alt="Logo do Projeto" width={120} height={40} className="self-center" />
              <form
                className="flex items-center bg-white rounded-full shadow px-4 py-2 w-96 md:w-[400px] self-center mr-2"
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
            <nav className="flex gap-8 items-center text-lg font-bold">
              <nav className="flex gap-8 items-center text-lg font-bold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <a
                  href="/"
                  className={`px-2 py-1 rounded transition-colors duration-200 font-extrabold ${pathname === '/' ? 'text-[#ffffff]' : 'text-white'}`}
                  style={pathname === '/' ? { textDecoration: 'underline', textDecorationThickness: '3px', textUnderlineOffset: '8px' } : {}}
                >
                  Home
                </a>
                <a
                  href="/corridas"
                  className={`px-2 py-1 rounded transition-colors duration-200 font-extrabold ${pathname === '/corridas' ? 'text-[#ffffff]' : 'text-white'}`}
                  style={pathname === '/corridas' ? { textDecoration: 'underline', textDecorationThickness: '3px', textUnderlineOffset: '8px' } : {}}
                >
                  Corridas
                </a>
              </nav>
            </nav>
            <div className="flex items-center gap-6 justify-center ml-8">
              <Link href="/signin" title="Login" className="hover:ring-indigo-300">
                <span className="flex items-center">
                  <span className="bg-white text-[#1E5AA8] font-bold rounded-3xl px-6 py-2 shadow border border-[#1E5AA8] cursor-pointer">
                    Login
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
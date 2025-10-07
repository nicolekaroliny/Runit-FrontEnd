"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function navClass(active: boolean) {
  return [
    "px-2 py-1 rounded font-extrabold transition-colors",
    active ? "bg-white text-[#20017B] shadow" : "text-white hover:underline",
  ].join(" ");
}

export default function Header({ userName = "usuário" }: { userName?: string }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  return (
    <header
      className="w-full relative py-6 h-24 flex items-center rounded-b-3xl z-50"
      style={{ background: "#1E5AA8", color: "#fff" }}
    >
      <div className="w-full flex items-center justify-between px-8">
        {/* logo + busca */}
        <div className="flex items-center gap-6 h-full">
          <Link href="/" className="self-center">
            <Image src="/images/logo.png" alt="Logo do Projeto" width={120} height={40} priority />
          </Link>

          <form
            className="flex items-center bg-white rounded-full shadow px-3 py-1 w-56 md:w-72 self-center mr-2"
            onSubmit={(e) => { e.preventDefault(); /* TODO: acionar sua busca */ }}
          >
            {/* ícone lupa */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="#20017B" strokeWidth="2" className="w-5 h-5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65"
                    stroke="#20017B" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none text-gray-700 text-sm ml-2 flex-1"
              style={{ minWidth: "120px" }}
            />
          </form>
        </div>

        {/* navegação central */}
        <nav className="flex gap-8 items-center text-2xl font-bold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className={navClass(pathname === "/")}>Home</Link>
          <Link href="/corridas" className={navClass(pathname === "/corridas")}>Corridas</Link>
          {/* adicione mais rotas quando quiser */}
        </nav>

        {/* perfil à direita */}
        <div className="flex items-center gap-6">
          <Link href="/signin" title="Perfil" className="hover:ring-indigo-300">
            <span className="flex items-center">
              <span className="mr-3 text-white text-lg font-bold">Bem-vindo, {userName}!</span>
              <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth={2} stroke="#3b82f6" className="w-6 h-6">
                  <circle cx="12" cy="10" r="3" stroke="#3b82f6" strokeWidth="2" />
                  <path stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        d="M6 18c0-2.21 3.58-4 6-4s6 1.79 6 4" />
                </svg>
              </span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

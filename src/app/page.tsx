"use client";
import Image from "next/image";
import Link from "next/link";
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
        {/* Conteúdo principal baseado na imagem anexada */}
        <main className="flex flex-col gap-8 px-8 py-8 bg-white">
          {/* Barra de notícias no topo */}
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-black text-white text-xs px-2 py-1 rounded">ÚLTIMAS</span>
            <span className="text-sm text-gray-800 font-bold truncate">PUMA Velocity NITRO 4 é lançado no Brasil durante evento especial em São Paulo</span>
            <div className="ml-auto flex gap-1">
              <button className="border border-gray-300 rounded px-1 text-xs">&#60;</button>
              <button className="border border-gray-300 rounded px-1 text-xs">&#62;</button>
            </div>
          </div>

          {/* Novidades (abaixo do destaque) */}
          <div>
            <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-t">NOVIDADES</span>
            <div className="flex gap-4 bg-gray-100 rounded-b p-4">
              <img
                src="/images/blog3.jpg"
                alt="PUMA Velocity NITRO 4 é lançado no Brasil durante evento especial"
                className="w-32 h-24 object-cover rounded"
              />
              <div className="flex flex-col justify-between">
                <span className="bg-white text-xs text-gray-700 px-2 py-0.5 rounded mb-1 w-fit">Novidades</span>
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  PUMA Velocity NITRO 4 é lançado no Brasil durante evento especial
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna lateral direita (notícias menores) */}
        <div className="flex flex-col gap-2">
          <div className="relative h-[110px]">
            <img
              src="/images/blog4.jpg"
              alt="Os 10 melhores tênis de corrida da Olympikus em 2025"
              className="w-full h-full object-cover rounded"
            />
            <span className="absolute bottom-2 left-2 right-2 text-white text-sm font-bold drop-shadow-lg">
              Os 10 melhores tênis de corrida da Olympikus em 2025
            </span>
          </div>
          <div className="relative h-[110px]">
            <img
              src="/images/blog5.jpg"
              alt="PUMA Velocity NITRO 4 é lançado no Brasil durante evento especial em São Paulo"
              className="w-full h-full object-cover rounded"
            />
            <span className="absolute bottom-2 left-2 right-2 text-white text-sm font-bold drop-shadow-lg">
              PUMA Velocity NITRO 4 é lançado no Brasil durante evento especial em São Paulo
            </span>
          </div>
          <div className="relative h-[110px]">
            <img
              src="/images/blog6.jpg"
              alt="São Silvestre abre inscrições para sua 100ª edição e espera 50 mil corredores em São Paulo"
              className="w-full h-full object-cover rounded"
            />
            <span className="absolute bottom-2 left-2 right-2 text-white text-sm font-bold drop-shadow-lg">
              São Silvestre abre inscrições para sua 100ª edição e espera 50 mil corredores em São Paulo
            </span>
          </div>
        </div>
      </div>

      {/* Linha de novidades e newsletter */}
      <div className="grid grid-cols-3 gap-6 mt-8">
        {/* Lista de novidades */}
        <div className="col-span-2 flex gap-4">
          <img
            src="/images/blog3.jpg"
            alt="PUMA Velocity NITRO 4 é lançado no Brasil durante evento especial"
            className="w-40 h-32 object-cover rounded"
          />
          <div className="flex flex-col gap-2 flex-1">
            <h4 className="text-base font-bold text-gray-900 leading-tight">
              PUMA Velocity NITRO 4 é lançado no Brasil durante evento especial
            </h4>
            <div className="flex flex-col gap-1 text-xs text-gray-700">
              <span>
                São Silvestre abre inscrições para sua 100ª edição e espera 50 mil corredores em São Paulo
                <span className="ml-2 text-gray-400">23/09/2025</span>
              </span>
              <span>
                Hybrid Run 2025 traz experiência do Hyrox ao Recife em novembro
                <span className="ml-2 text-gray-400">22/09/2025</span>
              </span>
              <span>
                Pernambucanos brilham em pódios no fim de semana em João Pessoa e Salvador
                <span className="ml-2 text-gray-400">22/09/2025</span>
              </span>
            </div>
          </div>
        </div>

        {/* Newsletter e redes sociais */}
        <div className="flex flex-col gap-4 bg-white p-6 rounded shadow min-w-[320px]">
          <h5 className="text-xl font-bold text-gray-900 mb-2">Assine nossa Newsletter</h5>
          <p className="text-sm text-gray-700 mb-2">
            Para ser atualizado com todas as últimas notícias, ofertas e novidades em primeira mão!
          </p>
          <div className="flex gap-2 mb-2">
            <input type="email" placeholder="Seu endereço de email" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" />
            <button className="bg-blue-500 text-white px-4 py-2 rounded font-bold">Inscreva-se!</button>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded font-bold text-sm">SIGA A GENTE NAS REDES!</button>
          <div className="flex gap-4 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-blue-800 font-bold text-lg">11,524</span>
              <span className="text-xs text-gray-700">Fãs</span>
              <button className="text-blue-600 text-xs font-bold">CURTIR</button>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-blue-800 font-bold text-lg">39,163</span>
              <span className="text-xs text-gray-700">Seguidores</span>
              <button className="text-blue-600 text-xs font-bold">SEGUIR</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
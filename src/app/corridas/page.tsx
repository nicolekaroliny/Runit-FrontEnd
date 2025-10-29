"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Link from "next/link";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { corridas } from "./data";

const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

function getDatePartsPT(dataHora: string) {
  const m = dataHora.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  const months = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
  if (!m) return { day: "--", mon: "--" };
  return { day: m[1], mon: months[parseInt(m[2], 10) - 1] || "--" };
}

export default function CorridasPage() {
  const [selectedId, setSelectedId] = useState<string | undefined>(corridas[0]?.id);
  const selected = useMemo(() => corridas.find((c) => c.id === selectedId), [selectedId]);

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
    <main className="px-8 py-8 max-w-[1400px] mx-auto">
      <h1 className="text-4xl font-extrabold text-[var(--runit-strong)] mb-6">Corridas</h1>

      <div className="grid grid-cols-12 gap-8">
 {/* LISTA (esquerda) — estilo “duas cápsulas” azuis */}
<aside className="col-span-12 lg:col-span-4">
  <div className="flex flex-col gap-4 max-h-[78vh] overflow-y-auto pr-2">
    {corridas.map((c) => {
      const { day, mon } = getDatePartsPT(c.dataHora);
      const active = c.id === selectedId;

      return (
        <button
          key={c.id}
          onClick={() => setSelectedId(c.id)}
          className="group w-full flex items-center gap-3"
        >
          {/* Pílula da data (esquerda) */}
          <div
            className={[
              "w-16 h-16 rounded-xl",
              "bg-[var(--runit-primary)] text-white",
              "flex flex-col items-center justify-center leading-none",
              "shadow-sm group-hover:brightness-[1.05] transition",
              active ? "outline outline-2 outline-white/70 shadow" : "",
            ].join(" ")}
          >
            <span className="text-2xl font-extrabold">{day}</span>
            <span className="text-[11px] font-extrabold tracking-wide mt-0.5">
              {mon}
            </span>
          </div>

          {/* Pílula de conteúdo (direita) */}
          <div
            className={[
              "flex-1 rounded-2xl px-5 py-3",
              "bg-[var(--runit-primary)] text-white",
              "text-center shadow-sm group-hover:brightness-[1.05] transition",
              active ? "ring-2 ring-white/70" : "",
            ].join(" ")}
          >
            <div className="font-extrabold text-[15px] leading-tight">
              {c.titulo}
            </div>
            <div className="text-[13px] opacity-95 leading-tight">
              {c.local}
            </div>
            <div className="text-[12px] opacity-85 leading-tight">
              {c.distancias}
            </div>
          </div>
        </button>
      );
    })}
  </div>
</aside>

        {/* MAPA (direita) + overlay */}
        <section className="col-span-12 lg:col-span-8">
          {/* fundo arredondado azul-claro como no mock */}
          <div className="relative rounded-3xl p-3 bg-[var(--runit-map-card-bg)] shadow-sm">
            <div className="overflow-hidden rounded-2xl">
              <MapView
                corridas={corridas}
                selectedId={selectedId}
                onSelect={setSelectedId}
                height="78vh"
              />
            </div>

            {/* CARD DE DETALHES SOBRE O MAPA */}
            {selected && (
              <div className="absolute top-6 left-6 z-[10000] w-[400px]">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  {/* header azul (um pouco mais claro que o primary) */}
                  <div className="bg-[var(--runit-primary-600)] text-white px-5 py-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-extrabold">Detalhes</h2>
                      <button
                        onClick={() => setSelectedId(undefined)}
                        className="bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center"
                        aria-label="Fechar"
                        title="Fechar"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-white">
                    {/* “chips” com borda arredondada preta clara */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="rounded-xl p-3 border border-[var(--runit-chip-border)]">
                        <div className="text-xs text-[var(--runit-muted)]">Data</div>
                        <div className="font-extrabold text-[var(--runit-strong)]">
                          {selected.dataHora}
                        </div>
                      </div>
                      <div className="rounded-xl p-3 border border-[var(--runit-chip-border)]">
                        <div className="text-xs text-[var(--runit-muted)]">Local</div>
                        <div className="font-extrabold text-[var(--runit-strong)]">
                          {selected.local}
                        </div>
                      </div>
                    </div>

                    {/* título + distâncias (sem banner para ficar igual ao figma) */}
                    <div className="mb-4">
                      <h3 className="text-lg font-extrabold text-[var(--runit-strong)]">
                        {selected.titulo}
                      </h3>
                      <div className="text-sm text-[var(--runit-muted)]">{selected.distancias}</div>
                    </div>

                    {/* botão Acessar (azul igual ao da pílula) */}
                    {selected.link ? (
                      <a
                        href={selected.link}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full text-center rounded-lg py-3 font-extrabold text-white bg-[var(--runit-primary)] hover:bg-[#174a8a] transition"
                      >
                        Acessar
                      </a>
                    ) : (
                      <span className="block w-full text-center rounded-lg py-3 font-extrabold text-white bg-slate-400">
                        Inscrições encerradas
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

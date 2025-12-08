'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './authcontext';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        {/* Mensagem de Boas-vindas */}
        <div className="hidden md:block text-right">
          <p className="text-sm text-white/90 font-normal">Bem-vindo,</p>
          <p className="text-sm font-bold text-white">{user.name}</p>
        </div>

        {/* Foto de Perfil */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="relative w-12 h-12 rounded-full border-2 border-white/80 hover:border-white transition-all overflow-hidden bg-white shadow-lg hover:shadow-xl hover:scale-105 duration-200"
          title={`${user.name}`}
        >
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-56 bg-card rounded-xl shadow-2xl border border-foreground py-2 z-50 animate-fadeIn">
            <div className="px-4 py-3 border-b border-foreground">
              <p className="text-sm font-bold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-semibold">
                {user.user_type === 'admin' ? 'Administrador' : user.user_type === 'editor' ? 'Editor' : 'Usuário'}
              </span>
            </div>

            {user.user_type === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/10 transition-colors text-primary text-sm font-semibold border-b border-border"
                onClick={() => setDropdownOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Painel Admin
              </Link>
            )}

            {user.user_type === 'editor' && (
              <Link
                href="/painel-editor"
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/10 transition-colors text-primary text-sm font-semibold border-b border-border"
                onClick={() => setDropdownOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Painel do Editor
              </Link>
            )}

            <Link
              href="/perfil"
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/90 transition-colors text-foreground text-sm"
              onClick={() => setDropdownOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Meu Perfil
            </Link>

            {/* <Link
              href="/configuracoes"
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/90 transition-colors text-foreground text-sm"
              onClick={() => setDropdownOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurações
            </Link> */}

            <div className="border-t border-foreground mt-2"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-destructive text-sm w-full"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

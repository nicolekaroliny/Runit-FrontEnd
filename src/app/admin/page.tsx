'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';
import CategoryManagement from '@/app/components/CategoryManagement';
import BlogManagement from '@/app/components/BlogManagement';
import RaceManagement from '@/app/components/RaceManagement';

type AdminSection = 'dashboard' | 'categories' | 'blog' | 'races' | 'users' | 'analytics' | 'settings';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/signin');
      return;
    }
    setIsAuthorized(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Acesso negado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-card border-r border-border p-6">
          <h1 className="text-2xl font-bold text-foreground mb-8">Admin</h1>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'dashboard'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveSection('categories')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'categories'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              Categorias
            </button>
            
            <button
              onClick={() => setActiveSection('blog')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'blog'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              Gerenciar Blog
            </button>
            
            <button
              onClick={() => setActiveSection('races')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'races'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              Corridas
            </button>
            
            <button
              onClick={() => setActiveSection('users')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'users'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              Usuários
            </button>
            
            <button
              onClick={() => setActiveSection('analytics')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'analytics'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              Analíticas
            </button>
            
            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'settings'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              Configurações
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeSection === 'dashboard' && (
            <>
              <header className="mb-12">
                <h1 className="text-5xl font-extrabold text-foreground mb-2">
                  Painel de Administrador
                </h1>
                <p className="text-xl text-muted-foreground">
                  Gerencie o blog, usuários e conteúdo da plataforma
                </p>
              </header>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-card rounded-lg shadow-md border border-border p-6">
                  <h3 className="text-muted-foreground text-sm font-medium mb-2">Total de Posts</h3>
                  <p className="text-3xl font-bold text-foreground">-</p>
                </div>

                <div className="bg-card rounded-lg shadow-md border border-border p-6">
                  <h3 className="text-muted-foreground text-sm font-medium mb-2">Total de Usuários</h3>
                  <p className="text-3xl font-bold text-foreground">-</p>
                </div>

                <div className="bg-card rounded-lg shadow-md border border-border p-6">
                  <h3 className="text-muted-foreground text-sm font-medium mb-2">Categorias</h3>
                  <p className="text-3xl font-bold text-foreground">-</p>
                </div>

                <div className="bg-card rounded-lg shadow-md border border-border p-6">
                  <h3 className="text-muted-foreground text-sm font-medium mb-2">Posts em Rascunho</h3>
                  <p className="text-3xl font-bold text-foreground">-</p>
                </div>
              </div>

              {/* Navigation Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  onClick={() => setActiveSection('categories')}
                  className="bg-card rounded-lg shadow-md border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-3">Gerenciar Categorias</h2>
                  <p className="text-muted-foreground mb-4">
                    Crie e edite categorias de posts
                  </p>
                </div>

                <div
                  onClick={() => setActiveSection('blog')}
                  className="bg-card rounded-lg shadow-md border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-3">Gerenciar Blog</h2>
                  <p className="text-muted-foreground mb-4">
                    Crie, edite e delete posts do blog
                  </p>
                </div>

                <div
                  onClick={() => setActiveSection('races')}
                  className="bg-card rounded-lg shadow-md border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-3">Gerenciar Corridas</h2>
                  <p className="text-muted-foreground mb-4">
                    Crie, edite e delete corridas
                  </p>
                </div>

                <div
                  onClick={() => setActiveSection('users')}
                  className="bg-card rounded-lg shadow-md border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-3">Gerenciar Usuários</h2>
                  <p className="text-muted-foreground mb-4">
                    Administre usuários e permissões
                  </p>
                </div>

                <div className="bg-card rounded-lg shadow-md border border-border p-6 hover:shadow-lg transition-shadow cursor-not-allowed opacity-50">
                  <h2 className="text-2xl font-bold text-foreground mb-3">Moderação de Conteúdo</h2>
                  <p className="text-muted-foreground mb-4">
                    Revise e modere comentários e conteúdo
                  </p>
                </div>

                <div
                  onClick={() => setActiveSection('analytics')}
                  className="bg-card rounded-lg shadow-md border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-3">Analíticas</h2>
                  <p className="text-muted-foreground mb-4">
                    Visualize estatísticas e relatórios
                  </p>
                </div>

                <div
                  onClick={() => setActiveSection('settings')}
                  className="bg-card rounded-lg shadow-md border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-3">Configurações</h2>
                  <p className="text-muted-foreground mb-4">
                    Configure as preferências da plataforma
                  </p>
                </div>
              </div>
            </>
          )}

          {activeSection === 'categories' && <CategoryManagement />}

          {activeSection === 'blog' && <BlogManagement />}

          {activeSection === 'races' && <RaceManagement />}

          {activeSection === 'users' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Gerenciar Usuários</h2>
                <p className="text-muted-foreground mt-1">
                  Administre usuários e permissões da plataforma
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                <p className="text-yellow-800 text-lg">
                  🚧 Esta funcionalidade está em desenvolvimento
                </p>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Analíticas</h2>
                <p className="text-muted-foreground mt-1">
                  Visualize estatísticas e relatórios de desempenho
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                <p className="text-yellow-800 text-lg">
                  🚧 Esta funcionalidade está em desenvolvimento
                </p>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Configurações</h2>
                <p className="text-muted-foreground mt-1">
                  Configure as preferências da plataforma
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                <p className="text-yellow-800 text-lg">
                  🚧 Esta funcionalidade está em desenvolvimento
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

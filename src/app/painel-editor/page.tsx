'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authcontext';
import CategoryManagement from '@/app/components/CategoryManagement';
import BlogManagement from '@/app/components/BlogManagement';
import { BlogService } from '@/lib/api/blogservice';

type EditorSection = 'dashboard' | 'categories' | 'blog';

interface EditorStats {
  myPosts: number;
  publishedPosts: number;
  draftPosts: number;
}

export default function EditorDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<EditorSection>('dashboard');
  const [stats, setStats] = useState<EditorStats>({
    myPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
      return;
    }
    
    if (!isLoading && user && user.user_type !== 'editor' && user.user_type !== 'admin') {
      router.push('/');
      return;
    }
  }, [user, isLoading, router]);

  const loadEditorStats = async () => {
    setLoadingStats(true);
    try {
      const allPosts = await BlogService.getAllAdminPosts();
      
      // Filtrar posts do autor atual
      const myPosts = allPosts.filter(post => post.author?.id === parseInt(user?.id || '0'));
      const publishedCount = myPosts.filter(post => post.status === 'PUBLISHED').length;
      const draftCount = myPosts.filter(post => post.status === 'DRAFT').length;

      setStats({
        myPosts: myPosts.length,
        publishedPosts: publishedCount,
        draftPosts: draftCount,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (user && activeSection === 'dashboard') {
      loadEditorStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeSection]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.user_type !== 'editor' && user.user_type !== 'admin')) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold">Acesso negado</p>
          <p className="text-muted-foreground mt-2">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-card border-r border-border p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Editor</h1>
            <p className="text-sm text-muted-foreground mt-1">Painel de Conteúdo</p>
          </div>
          
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
          </nav>

          {/* User Info */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user.user_type === 'admin' ? 'Admin' : 'Editor'}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeSection === 'dashboard' && (
            <>
              <header className="mb-12">
                <h1 className="text-5xl font-extrabold text-foreground mb-2">
                  Painel do Editor
                </h1>
                <p className="text-xl text-muted-foreground">
                  Gerencie posts do blog e categorias
                </p>
              </header>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-card rounded-lg shadow-md border border-border p-6">
                  <h3 className="text-muted-foreground text-sm font-medium mb-2">Meus Posts</h3>
                  {loadingStats ? (
                    <div className="animate-pulse h-9 bg-muted rounded w-16"></div>
                  ) : (
                    <p className="text-3xl font-bold text-foreground">{stats.myPosts}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">Posts criados por você</p>
                </div>

                <div className="bg-card rounded-lg shadow-md border border-border p-6">
                  <h3 className="text-muted-foreground text-sm font-medium mb-2">Posts Publicados</h3>
                  {loadingStats ? (
                    <div className="animate-pulse h-9 bg-muted rounded w-16"></div>
                  ) : (
                    <p className="text-3xl font-bold text-foreground">{stats.publishedPosts}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">Posts com status publicado</p>
                </div>

                <div className="bg-card rounded-lg shadow-md border border-border p-6">
                  <h3 className="text-muted-foreground text-sm font-medium mb-2">Rascunhos</h3>
                  {loadingStats ? (
                    <div className="animate-pulse h-9 bg-muted rounded w-16"></div>
                  ) : (
                    <p className="text-3xl font-bold text-foreground">{stats.draftPosts}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">Posts em modo rascunho</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    onClick={() => setActiveSection('blog')}
                    className="bg-card rounded-lg shadow-md border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">Criar Novo Post</h3>
                        <p className="text-sm text-muted-foreground">
                          Comece a escrever um novo artigo para o blog
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveSection('categories')}
                    className="bg-card rounded-lg shadow-md border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">Gerenciar Categorias</h3>
                        <p className="text-sm text-muted-foreground">
                          Organize o conteúdo em categorias
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-muted/30 border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">📝 Dicas para Editores</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Use categorias para organizar melhor o conteúdo do blog</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Salve posts como rascunho para revisão antes de publicar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Adicione imagens de destaque para tornar os posts mais atraentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Escreva excerpts (resumos) claros e objetivos para cada post</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {activeSection === 'categories' && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar ao Dashboard
                </button>
              </div>
              <CategoryManagement />
            </div>
          )}

          {activeSection === 'blog' && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar ao Dashboard
                </button>
              </div>
              <BlogManagement />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

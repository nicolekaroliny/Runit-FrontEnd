'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogService } from '@/lib/api/blogservice';
import { BlogPost } from '@/types/blog.types';

interface BlogListProps {
  title?: string;
  subtitle?: string;
  showSidebar?: boolean;
}

export default function BlogList({
  title = 'Últimas Notícias',
  subtitle = 'Descubra artigos, dicas e análises sobre corrida e desempenho.',
  showSidebar = true,
}: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await BlogService.getPublishedPosts(0, 50);
      setPosts(data.content || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts');
      console.error('Erro ao buscar posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (post: BlogPost) => {
    const imageUrl = post.imageUrl || post.thumbnailUrl;
    if (!imageUrl) {
      return 'https://via.placeholder.com/800x400?text=Sem+Imagem';
    }
    return imageUrl.startsWith('http') ? imageUrl : imageUrl;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Data inválida';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (error) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchPosts}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Carousel: primeiros 3 posts (ou menos se não houver)
  const carouselPosts = posts.slice(0, 3);
  
  // Grid 2x3: próximos 6 posts
  const recentPosts = posts.slice(3, 9);

  // Sidebar: posts para "Mais Lidos"
  const sidebarPosts = posts.slice(0, Math.min(5, posts.length));

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título Principal */}
        <header className="text-center mb-12 pt-4">
          <h1
            className="text-5xl font-extrabold text-foreground mb-2"
            style={{ color: '#C52F33' }}
          >
            {title}
          </h1>
          <p className="text-xl text-muted-foreground">{subtitle}</p>
        </header>

        {/* Layout Principal */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Coluna Principal */}
          <main className={showSidebar ? 'w-full lg:w-3/4' : 'w-full'}>
            {/* CARROSSEL DE DESTAQUES */}
            {carouselPosts.length > 0 && !loading && (
              <section className="mb-16">
                <div className="relative">
                  {/* Carrossel Container */}
                  <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg bg-muted">
                    {carouselPosts.map((post, index) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug || post.id}`}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          index === currentCarouselIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <div className="relative w-full h-full">
                          {/* Imagem de Fundo */}
                          <img
                            src={getImageUrl(post)}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Overlay Escuro */}
                          <div className="absolute inset-0 bg-black/40" />
                          
                          {/* Conteúdo */}
                          <div className="absolute inset-0 flex flex-col justify-end p-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 line-clamp-2">
                              {post.title}
                            </h2>
                            <p className="text-white/90 text-sm md:text-base line-clamp-2 mb-3">
                              {post.excerpt}
                            </p>
                            <div className="text-white/80 text-sm">
                              {formatDate(post.publicationDate || post.createdAt)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}

                    {/* Botões de Navegação */}
                    {carouselPosts.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentCarouselIndex(
                              (prev) => (prev - 1 + carouselPosts.length) % carouselPosts.length
                            )
                          }
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
                        >
                          &#10094;
                        </button>
                        <button
                          onClick={() =>
                            setCurrentCarouselIndex(
                              (prev) => (prev + 1) % carouselPosts.length
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
                        >
                          &#10095;
                        </button>
                      </>
                    )}

                    {/* Indicadores de Página */}
                    {carouselPosts.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {carouselPosts.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentCarouselIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentCarouselIndex
                                ? 'bg-white'
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ARTIGOS RECENTES - GRID 2x3 */}
            {!loading && (
              <section>
                <h2 className="text-3xl font-bold text-foreground mb-8 border-b-2 pb-3 border-primary">
                  Artigos Recentes
                </h2>
                {recentPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug || post.id}`}
                        className="group"
                      >
                        <article className="h-full bg-card rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-border flex flex-col">
                          {/* Imagem */}
                          <div className="relative w-full h-48 overflow-hidden bg-muted">
                            <img
                              src={getImageUrl(post)}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* Conteúdo */}
                          <div className="p-4 flex flex-col flex-grow">
                            {/* Data */}
                            <div className="text-xs text-muted-foreground mb-2">
                              {formatDate(post.publicationDate || post.createdAt)}
                            </div>

                            {/* Título */}
                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 flex-grow">
                              {post.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {post.excerpt}
                            </p>

                            {/* CTA */}
                            <div className="text-sm font-medium text-primary group-hover:underline">
                              Leia Mais →
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Nenhum artigo disponível no momento.</p>
                  </div>
                )}
              </section>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground mt-4">Carregando artigos...</p>
              </div>
            )}
          </main>

          {/* SIDEBAR */}
          {showSidebar && (
            <aside className="w-full lg:w-1/4 space-y-8">
              {/* Mais Lidos */}
              {sidebarPosts.length > 0 && !loading && (
                <div className="bg-card p-6 rounded-xl shadow-md border border-border">
                  <h3 className="text-xl font-bold mb-4 border-b pb-2 text-primary border-border">
                    Mais Lidos
                  </h3>
                  <div className="space-y-3">
                    {sidebarPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug || post.id}`}
                        className="block border-l-4 pl-3 py-2 hover:bg-muted transition-colors border-primary group"
                      >
                        <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(post.publicationDate || post.createdAt)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-primary/10 p-6 rounded-xl border border-primary/20">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Fique por Dentro
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Receba as melhores notícias sobre corrida e desempenho diretamente na sua caixa de entrada.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Seu email"
                    className="flex-1 px-3 py-2 rounded text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:opacity-90 transition-opacity">
                    Se inscrever
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

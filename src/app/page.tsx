'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, TrendingUp, Tag } from 'lucide-react';
import { BlogService } from '@/lib/api/blogservice';
import { CategoryService } from '@/lib/api/categoryservice';
import { BlogPost, BlogCategory, PaginatedResponse } from '@/types/blog.types';

// --- Utilitários ---
const formatDate = (isoString: string | undefined) => {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

// --- Componentes de UI ---

// 1. Badge de Categoria
const CategoryBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
    {name}
  </span>
);

// 2. Card Hero (O Destaque Principal)
const HeroPostCard = ({ post }: { post: BlogPost }) => (
  <Link
    href={`/blog/${post.slug || post.id}`}
    className="group grid grid-cols-1 md:grid-cols-2 gap-6 bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50"
  >
    <div className="relative overflow-hidden h-64 md:h-auto">
      <img
        src={
          post.imageUrl || post.thumbnailUrl
            ? post.imageUrl || post.thumbnailUrl
            : 'https://placehold.co/600x400/3498db/ffffff?text=Blog'
        }
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
    </div>

    <div className="p-6 md:p-8 flex flex-col justify-center">
      <div className="flex gap-2 mb-3 flex-wrap">
        {post.categories && post.categories.length > 0 ? (
          post.categories.slice(0, 2).map((cat: BlogCategory, idx: number) => (
            <CategoryBadge key={idx} name={cat.name} />
          ))
        ) : (
          <CategoryBadge name="Blog" />
        )}
      </div>

      <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight leading-tight group-hover:text-primary transition-colors">
        {post.title}
      </h2>

      <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col text-xs">
            <span className="font-semibold text-foreground">Runit</span>
            <span className="text-muted-foreground">
              {formatDate(post.publicationDate || post.createdAt)}
            </span>
          </div>
        </div>
        <span className="flex items-center text-sm font-semibold text-primary">
          Ler artigo{' '}
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  </Link>
);

// 3. Card Padrão (Grid)
const StandardPostCard = ({ post }: { post: BlogPost }) => (
  <Link
    href={`/blog/${post.slug || post.id}`}
    className="group flex flex-col bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-border/50 h-full"
  >
    <div className="relative h-56 overflow-hidden">
      <img
        src={
          post.imageUrl || post.thumbnailUrl
            ? post.imageUrl || post.thumbnailUrl
            : 'https://placehold.co/400x300/3498db/ffffff?text=Post'
        }
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>

    <div className="flex flex-col flex-grow p-5">
      <div className="mb-3">
        {post.categories && post.categories.length > 0 ? (
          <CategoryBadge name={post.categories[0].name} />
        ) : (
          <CategoryBadge name="Blog" />
        )}
      </div>

      <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
        {post.title}
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
        {post.excerpt}
      </p>

      <div className="flex items-center text-xs text-muted-foreground mt-4 pt-4 border-t border-border/40">
        <Calendar className="w-3.5 h-3.5 mr-1.5" />
        {formatDate(post.publicationDate || post.createdAt)}
      </div>
    </div>
  </Link>
);

// 4. Sidebar Item: Trending/Mais Lidos
const TrendingItem = ({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) => (
  <Link
    href={`/blog/${post.slug || post.id}`}
    className="flex gap-4 group items-start hover:opacity-80 transition-opacity"
  >
    <span className="text-3xl font-black text-muted-foreground/20 group-hover:text-primary/50 transition-colors leading-none -mt-1">
      0{index + 1}
    </span>
    <div>
      <h4 className="font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
        {post.title}
      </h4>
      <span className="text-xs text-muted-foreground mt-1 block">
        {formatDate(post.publicationDate || post.createdAt)}
      </span>
    </div>
  </Link>
);

// --- Página Principal ---
export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Buscar posts
        const postsData: PaginatedResponse<BlogPost> =
          await BlogService.getPublishedPosts(0, 10);
        const allPosts = postsData.content || [];

        // Filtrar apenas posts com categoria "Destaques" para hero
        const destaquePosts = allPosts.filter((post) =>
          post.categories?.some(
            (cat: BlogCategory) =>
              cat.name.toLowerCase() === 'destaques'
          )
        );

        // Se não houver destaques, usar os mais recentes
        const heroPost =
          destaquePosts.length > 0 ? destaquePosts[0] : allPosts[0];

        // Pegar outros posts para grid
        const otherPosts = allPosts.filter((p) => p.id !== heroPost?.id);

        setPosts([heroPost, ...otherPosts].filter(Boolean));

        // Buscar categorias
        const categoriesData = await CategoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando blog...</p>
        </div>
      </div>
    );
  }

  const heroPost = posts.length > 0 ? posts[0] : null;
  const featuredPosts = posts.length >= 3 ? posts.slice(1, 3) : posts.slice(1);
  const recentPosts =
    posts.length >= 3 ? posts.slice(3) : posts.length > 1 ? [posts[1]] : [];

  // Extraindo categorias únicas dos posts
  const uniqueCategories = Array.from(
    new Set(
      posts
        .flatMap((p) => p.categories || [])
        .map((c: BlogCategory) => c.id)
    )
  )
    .map((id) =>
      posts
        .flatMap((p) => p.categories || [])
        .find((c: BlogCategory) => c.id === id)
    )
    .filter(Boolean) as BlogCategory[];

  return (
    <div className="bg-background min-h-screen">
      
      {/* Header Minimalista */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-16 text-center">
          <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
            Runit Blog
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 tracking-tight">
            Performance & Tecnologia
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Notícias, dicas avançadas e análises profundas sobre o universo da corrida.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* COLUNA PRINCIPAL */}
          <main className="w-full lg:w-3/4">
            
            {/* 1. Hero Section */}
            {heroPost && (
              <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Destaque da Semana
                  </h2>
                </div>
                <HeroPostCard post={heroPost} />
              </section>
            )}

            {/* 2. Grid de Artigos */}
            {recentPosts.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Últimos Artigos
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recentPosts.map((post) => (
                    <StandardPostCard key={post.id} post={post} />
                  ))}
                  {/* Fallback para preencher a grid se tiver poucos posts recentes */}
                  {recentPosts.length < 2 &&
                    featuredPosts.map((post) => (
                      <StandardPostCard key={post.id} post={post} />
                    ))}
                </div>
              </section>
            )}
          </main>

          {/* SIDEBAR */}
          <aside className="w-full lg:w-1/4 space-y-10 lg:pt-14">
            
            {/* Widget: Mais Lidos (Trending) */}
            {featuredPosts.length > 0 && (
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-primary">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="font-bold text-lg text-foreground">Em Alta</h3>
                </div>
                <div className="space-y-6">
                  {featuredPosts.map((post, idx) => (
                    <TrendingItem
                      key={post.id}
                      post={post}
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Widget: Categorias */}
            {uniqueCategories.length > 0 && (
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-primary">
                  <Tag className="w-5 h-5" />
                  <h3 className="font-bold text-lg text-foreground">Explorar</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/blog?category=${encodeURIComponent(cat.name)}`}
                      className="px-3 py-1.5 bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link
                    href="/blog"
                    className="px-3 py-1.5 bg-transparent border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    Ver tudo
                  </Link>
                </div>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 text-center">
              <h3 className="font-bold text-foreground mb-2">News da Runit</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Receba dicas de treino direto no seu e-mail.
              </p>
              <Link
                href="/signup"
                className="w-full inline-block bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition"
              >
                Inscrever-se
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

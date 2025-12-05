'use client';
import React from 'react';

// --- Interfaces de Dados do Post Simulam o DTO de Back-end ---

export interface Author {
  id: number;
  name: string;
  lastName: string;
  profilePictureUrl?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnailUrl?: string;
  publicationDate: string;
  author: Author;
  categories: Category[];
}

// --- Dados de Mock ---
const MOCK_AUTHOR_1: Author = { id: 1, name: 'Ana Paula', lastName: 'Corredora', profilePictureUrl: 'https://placehold.co/50x50/3498db/ffffff?text=AP' };
const MOCK_AUTHOR_2: Author = { id: 2, name: 'Fernando', lastName: 'Sprint', profilePictureUrl: 'https://placehold.co/50x50/2ecc71/ffffff?text=FS' };

const MOCK_CATEGORY_1: Category = { id: 10, name: 'Treino', slug: 'treino' };
const MOCK_CATEGORY_2: Category = { id: 20, name: 'Nutrição', slug: 'nutricao' };

export const mockPosts: Post[] = [
  {
    id: 101,
    slug: 'o-guia-completo-para-maratonas',
    title: 'O Guia Completo para Maratonas: Treino, Nutrição e Mentalidade',
    excerpt: 'Este guia abrangente aborda tudo o que você precisa saber para correr sua primeira maratona ou bater seu recorde pessoal, desde o plano de treino até a estratégia de prova.',
    publicationDate: '2025-12-03T10:00:00Z',
    thumbnailUrl: 'https://placehold.co/800x400/1E5AA8/ffffff?text=Imagem+Guia',
    author: MOCK_AUTHOR_1,
    categories: [MOCK_CATEGORY_1, MOCK_CATEGORY_2],
  },
  {
    id: 102,
    slug: 'entenda-o-treino-intervalado',
    title: 'Entenda o Treino Intervalado e Otimize sua Velocidade',
    excerpt: 'Descubra como os treinos intervalados curtos e longos podem turbinar seu VO2 máximo e fazer você correr mais rápido com menos esforço. Inclui exemplos práticos.',
    publicationDate: '2025-11-28T15:30:00Z',
    thumbnailUrl: 'https://placehold.co/400x200/539cf7/ffffff?text=Imagem+Intervalado',
    author: MOCK_AUTHOR_2,
    categories: [MOCK_CATEGORY_1],
  },
  {
    id: 103,
    slug: 'hidratacao-antes-durante-e-depois',
    title: 'Hidratação: Antes, Durante e Depois da Corrida',
    excerpt: 'A hidratação é a chave para a performance. Saiba a quantidade exata de água e eletrólitos que você deve consumir em diferentes climas e distâncias.',
    publicationDate: '2025-11-25T08:45:00Z',
    thumbnailUrl: 'https://placehold.co/400x200/1E5AA8/ffffff?text=Imagem+Hidratação',
    author: MOCK_AUTHOR_1,
    categories: [MOCK_CATEGORY_2],
  },
  {
    id: 104,
    slug: 'os-melhores-tenis-de-2025',
    title: 'Análise: Os Melhores Tênis de Corrida de 2025',
    excerpt: 'Revisamos os lançamentos mais aguardados do ano, focando em amortecimento, durabilidade e adequação para diferentes tipos de pisada e treino.',
    publicationDate: '2025-11-20T12:15:00Z',
    thumbnailUrl: 'https://placehold.co/400x200/539cf7/ffffff?text=Imagem+Tenis',
    author: MOCK_AUTHOR_2,
    categories: [MOCK_CATEGORY_1],
  },
  {
    id: 105,
    slug: 'recuperacao-ativa-versus-passiva',
    title: 'Recuperação Ativa vs. Passiva: O que Funciona Melhor?',
    excerpt: 'Descubra a ciência por trás da recuperação e como escolher entre um descanso total ou um exercício leve para acelerar a recuperação muscular pós-treino.',
    publicationDate: '2025-11-15T10:00:00Z',
    thumbnailUrl: 'https://placehold.co/400x200/1E5AA8/ffffff?text=Imagem+Recuperação',
    author: MOCK_AUTHOR_1,
    categories: [MOCK_CATEGORY_1],
  },
];

export const formatDate = (isoString: string) => {
  try {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return 'Data Inválida';
  }
};

interface PostCardProps {
  post: Post;
  isHero?: boolean;
  href?: string;
}

export const PostCard = ({ post, isHero = false, href }: PostCardProps) => {
  const titleClass = isHero ? 'text-4xl lg:text-5xl' : 'text-xl lg:text-2xl';
  const excerptClass = isHero ? 'text-lg mt-4' : 'text-sm mt-2';
  const fallbackImageUrl = `https://placehold.co/${isHero ? '800x400' : '400x200'}/1E5AA8/ffffff?text=Runit+Blog`;
  const link = href || `/blog/${post.slug}`;

  return (
    <a
      href={link}
      className={`group block p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${
        isHero ? 'bg-card/95 border-border' : 'bg-card border-border'
      }`}
    >
      {/* Imagem de Capa */}
      <div
        className={`w-full bg-muted mb-4 rounded-lg ${isHero ? 'h-52 md:h-80' : 'h-32'}`}
        style={{
          backgroundImage: `url(${post.thumbnailUrl || fallbackImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Título */}
      <h2 className={`${titleClass} font-extrabold text-foreground group-hover:text-primary transition-colors`}>
        {post.title}
      </h2>

      {/* Metadados */}
      <div className="flex items-center text-xs text-muted-foreground mt-2">
        {post.author.profilePictureUrl && (
          <img
            src={post.author.profilePictureUrl}
            alt={post.author.name}
            className="w-6 h-6 rounded-full mr-2 object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://placehold.co/50x50/898989/ffffff?text=${post.author.name.charAt(0)}`;
            }}
          />
        )}
        <p>
          Por <span className="font-semibold text-foreground/80">{`${post.author.name} ${post.author.lastName}`}</span> &middot; {formatDate(post.publicationDate)}
        </p>
      </div>

      {/* Excerpt */}
      <p className={`${excerptClass} text-foreground/80 line-clamp-3 mt-3`}>
        {post.excerpt}
      </p>

      {/* CTA */}
      <span className="text-sm font-medium text-primary group-hover:underline mt-3 block">
        Leia Mais &rarr;
      </span>
    </a>
  );
};

interface BlogListProps {
  title?: string;
  subtitle?: string;
  showSidebar?: boolean;
}

export default function BlogList({ title = 'Blog Runit: Desempenho e Tecnologia', subtitle = 'Notícias, dicas e análises sobre corrida, saúde e o mundo da Runit.', showSidebar = true }: BlogListProps) {
  const posts = mockPosts;
  const heroPost = posts.length > 0 ? posts[0] : null;
  const featuredPosts = posts.length >= 3 ? posts.slice(1, 3) : posts.slice(1);
  const recentPosts = posts.length >= 3 ? posts.slice(3) : [];

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título Principal */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-foreground mb-2">{title}</h1>
          <p className="text-xl text-muted-foreground">{subtitle}</p>
        </header>

        {/* Layout Principal */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Coluna Principal */}
          <main className={showSidebar ? 'w-full lg:w-3/4' : 'w-full'}>
            {/* Hero Post */}
            {heroPost && (
              <section className="mb-12">
                <PostCard post={heroPost} isHero={true} />
              </section>
            )}

            {/* Posts Recentes */}
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-6 border-b-2 pb-2 border-border">
                Artigos Recentes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {recentPosts.length === 0 && featuredPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  {featuredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </section>
          </main>

          {/* Sidebar */}
          {showSidebar && (
            <aside className="w-full lg:w-1/4 space-y-10">
              {/* Posts em Destaque */}
              {featuredPosts.length > 0 && (
                <div className="bg-card p-6 rounded-xl shadow-md border border-border">
                  <h3 className="text-xl font-bold mb-4 border-b pb-2 text-primary border-border">
                    Mais Lidos
                  </h3>
                  <div className="space-y-4">
                    {featuredPosts.map((post) => (
                      <a
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="block border-l-4 pl-3 py-1 hover:bg-muted transition-colors border-primary"
                      >
                        <p className="text-sm font-semibold text-foreground line-clamp-2">{post.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(post.publicationDate)}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Categorias */}
              <div className="bg-card p-6 rounded-xl shadow-md border border-border">
                <h3 className="text-xl font-bold mb-4 border-b pb-2 text-primary border-border">
                  Categorias
                </h3>
                <div className="space-y-2">
                  {Array.from(new Set(mockPosts.flatMap((p) => p.categories.map((c) => c.slug))))
                    .map((slug) => {
                      const cat = mockPosts.flatMap((p) => p.categories).find((c) => c.slug === slug)!;
                      return (
                        <a
                          key={cat.id}
                          href={`/blog/categoria/${cat.slug}`}
                          className="flex justify-between items-center text-sm text-foreground/90 hover:text-primary transition-colors"
                        >
                          <span className="font-medium">{cat.name}</span>
                          <span className="text-xs text-muted-foreground/70">
                            ({mockPosts.filter((p) => p.categories.some((c) => c.slug === slug)).length})
                          </span>
                        </a>
                      );
                    })}
                  <a
                    href="/blog/categoria/todos"
                    className="flex justify-between items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors pt-2 border-t border-border mt-3"
                  >
                    Ver Todos &rarr;
                  </a>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

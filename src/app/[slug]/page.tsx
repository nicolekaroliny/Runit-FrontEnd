'use client';

import { mockPosts, formatDate, PostCard } from '@/app/components/BlogList';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function PostDetailPage({ params }: PageProps) {
  const post = mockPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Posts relacionados (mesma categoria)
  const relatedPosts = mockPosts.filter(
    (p) =>
      p.slug !== post.slug &&
      p.categories.some((cat) => post.categories.some((c) => c.id === cat.id))
  ).slice(0, 3);

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Voltar */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 mt-8"
        >
          <ChevronLeft size={20} />
          Voltar
        </Link>

        {/* Cabeçalho do Post */}
        <header className="mb-12">
          {/* Imagem de capa */}
          <div
            className="w-full h-96 rounded-xl shadow-lg mb-8 bg-muted"
            style={{
              backgroundImage: `url(${post.thumbnailUrl || `https://placehold.co/800x400/1E5AA8/ffffff?text=Runit+Blog`})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Categorias */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((cat) => (
              <a
                key={cat.id}
                href={`/blog/categoria/${cat.slug}`}
                className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold hover:bg-primary/30 transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </div>

          {/* Título */}
          <h1 className="text-5xl font-extrabold text-foreground mb-4">{post.title}</h1>

          {/* Metadata */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-muted-foreground">
            {/* Autor */}
            <div className="flex items-center gap-3">
              {post.author.profilePictureUrl && (
                <img
                  src={post.author.profilePictureUrl}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://placehold.co/50x50/898989/ffffff?text=${post.author.name.charAt(0)}`;
                  }}
                />
              )}
              <div>
                <p className="font-semibold text-foreground">{`${post.author.name} ${post.author.lastName}`}</p>
                <p className="text-sm">Autor</p>
              </div>
            </div>

            {/* Data */}
            <div className="flex items-center gap-2">
              <p className="text-sm">{formatDate(post.publicationDate)}</p>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <article className="prose prose-invert max-w-none mb-16">
          <p className="text-xl text-foreground/80 leading-relaxed mb-8">{post.excerpt}</p>

          <div className="bg-card p-8 rounded-xl border border-border text-foreground/70">
            <p className="italic text-center">
              O conteúdo completo do artigo será carregado do backend em breve. Por enquanto, veja o resumo acima.
            </p>
          </div>
        </article>

        {/* Posts Relacionados */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-3xl font-bold text-foreground mb-8">Artigos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

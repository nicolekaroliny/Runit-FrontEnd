'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BlogPost, BlogCategory } from '@/types/blog.types';

// --- COMPONENTE DE UI: RENDERIZADOR DE CONTEÚDO MARKDOWN ---
const ContentRenderer = ({ markdown }: { markdown: string }) => {
  return (
    <div className="prose prose-lg md:prose-xl prose-invert max-w-none leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

// --- COMPONENTE DE UI: ESTADO DE ERRO/404 ---
const NotFoundState = ({ slug }: { slug: string }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
    <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-xl border border-border max-w-md w-full text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">🤔</span>
      </div>
      <h1 className="text-2xl font-bold mb-2">Postagem não encontrada</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Não conseguimos localizar o artigo com o identificador{' '}
        <code className="bg-muted px-1 py-0.5 rounded text-xs">{slug}</code>.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Voltar para o Blog
      </Link>
    </div>
  </div>
);

// --- COMPONENTE DE UI: LOADING STATE ---
const LoadingState = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Carregando artigo...</p>
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL (VIEW) ---
export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      // Tenta buscar primeiro por slug, depois por ID
      let response = await fetch(`${apiUrl}/api/blog/posts/slug/${resolvedParams.id}`);

      if (!response.ok) {
        // Se falhar, tenta por ID numérico
        response = await fetch(`${apiUrl}/api/blog/posts/${resolvedParams.id}`);
      }

      if (!response.ok) {
        throw new Error('Post não encontrado');
      }

      const data: BlogPost = await response.json();
      setPost(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar o post');
      console.error('Erro ao buscar post:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) {
      return 'https://via.placeholder.com/1200x600?text=Sem+Imagem';
    }
    return imageUrl.startsWith('http') ? imageUrl : imageUrl;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const estimateReadingTime = (content: string) => {
    // Aproximadamente 200 palavras por minuto
    const words = content.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min de leitura`;
  };

  useEffect(() => {
    fetchPost();
  }, [resolvedParams.id]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !post) {
    return <NotFoundState slug={resolvedParams.id} />;
  }

  const formattedDate = formatDate(post.publicationDate || post.createdAt);
  const readingTime = estimateReadingTime(post.content || '');

  return (
    <article className="min-h-screen bg-background text-foreground pb-20">
      {/* Container focado em leitura */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        
        {/* Navegação Topo */}
        <nav className="mb-8">
          <Link
            href="/blog"
            className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mr-2 transition-colors">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Voltar para listagem
          </Link>
        </nav>

        {/* Header do Artigo */}
        <header className="flex flex-col gap-6 mb-10">
          <div className="space-y-4">
            {/* Categorias */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map((cat: BlogCategory, idx: number) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* Título Principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              {post.title}
            </h1>

            {/* Subtítulo/Excerpt */}
            {post.excerpt && (
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Área do Autor e Metadados */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 border-y border-border/50 gap-4">
            <div className="flex items-center gap-3">
              {/* Avatar do Autor */}
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  Runit Blog
                </span>
                <span className="text-xs text-muted-foreground">
                  {readingTime}
                </span>
              </div>
            </div>

            {formattedDate && (
              <div className="flex items-center text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md whitespace-nowrap">
                <Calendar className="w-4 h-4 mr-2 opacity-70" />
                <time dateTime={post.publicationDate || post.createdAt}>
                  {formattedDate}
                </time>
              </div>
            )}
          </div>
        </header>

        {/* Imagem de Capa (Hero Image) */}
        {(post.imageUrl || post.thumbnailUrl) && (
          <figure className="mb-12 relative group overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
            <img
              src={getImageUrl(post.imageUrl || post.thumbnailUrl)}
              alt={post.title}
              className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </figure>
        )}

        {/* Corpo do Texto */}
        <main className="mb-12">
          {post.content ? (
            <ContentRenderer markdown={post.content} />
          ) : (
            <p className="text-muted-foreground">{post.excerpt}</p>
          )}
        </main>

        {/* Rodapé do Artigo */}
        <footer className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-muted-foreground">
          <span className="text-sm">Obrigado por ler! 🙏</span>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors font-medium"
          >
            <ChevronLeft size={16} />
            Voltar para o Blog
          </Link>
        </footer>
      </div>
    </article>
  );
}

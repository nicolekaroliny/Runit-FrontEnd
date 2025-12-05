'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  slug: string;
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [resolvedParams.id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      // Tenta buscar primeiro por slug, depois por ID
      let response = await fetch(`${apiUrl}/api/blog/posts/slug/${resolvedParams.id}`);
      
      if (!response.ok) {
        // Se falhar, tenta por ID
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

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) {
      return 'https://via.placeholder.com/800x400?text=Sem+Imagem';
    }
    return imageUrl.startsWith('http') ? imageUrl : `${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Carregando post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Post não encontrado</h1>
            <p className="text-muted-foreground mb-6">{error || 'O post que você procura não existe'}</p>
            <Link
              href="/blog"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
            >
              Voltar para notícias
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/blog" className="text-primary hover:underline">
            ← Voltar para notícias
          </Link>
        </div>

        {/* Article Container */}
        <article className="max-w-3xl mx-auto">
          {/* Featured Image */}
          {(post.imageUrl || post.thumbnailUrl) && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={getImageUrl(post.imageUrl || post.thumbnailUrl)}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Category and Meta */}
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            {post.category && (
              <span className="px-3 py-1 bg-gray-700 text-white text-sm font-semibold rounded-full">
                {post.category}
              </span>
            )}
            {post.createdAt && (
              <time className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-card-foreground mb-4">{post.title}</h1>

          {/* Excerpt */}
          <p className="text-lg text-muted-foreground mb-8 italic">{post.excerpt}</p>

          {/* Divider */}
          <hr className="border-border mb-8" />

          {/* Content */}
          <div className="prose prose-invert max-w-none text-card-foreground leading-relaxed">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p>{post.excerpt}</p>
            )}
          </div>

          {/* Footer Divider */}
          <hr className="border-border my-8" />

          {/* Back Link */}
          <div className="text-center">
            <Link
              href="/blog"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
            >
              ← Voltar para notícias
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

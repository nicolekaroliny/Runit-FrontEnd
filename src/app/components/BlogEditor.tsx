'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { BlogService } from '@/lib/api/blogservice';
import { BlogPost, BlogPostCreationDto } from '@/types/blog.types';
import { useAuth } from '@/context/authcontext';

interface BlogEditorProps {
  onSuccess?: (post: BlogPost) => void;
  initialPost?: BlogPost;
  isEditing?: boolean;
}

export function BlogEditor({ onSuccess, initialPost, isEditing = false }: BlogEditorProps) {
  let authContext;
  try {
    authContext = useAuth();
  } catch (e) {
    console.error('❌ Erro ao usar useAuth:', e);
  }

  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialPost?.imageUrl || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Auto-gerar slug a partir do título
  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Só atualizar slug se ele ainda não foi customizado
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 255);
  };

  // Validar antes de enviar
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (!slug.trim()) {
      newErrors.slug = 'Slug é obrigatório';
    }
    if (!content.trim()) {
      newErrors.content = 'Conteúdo é obrigatório';
    }
    if (content.trim().length < 100) {
      newErrors.content = 'Conteúdo deve ter no mínimo 100 caracteres';
    }
    if (excerpt.length > 500) {
      newErrors.excerpt = 'Resumo deve ter no máximo 500 caracteres';
    }
    if (thumbnailUrl && !isValidUrl(thumbnailUrl)) {
      newErrors.thumbnailUrl = 'URL da imagem deve ser válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Enviar para backend
  const handlePublish = async () => {
    if (!validate()) return;

    console.log('🔍 Auth Context:', authContext);
    console.log('🔍 Auth Context User:', authContext?.user);
    console.log('🔍 Auth Context User ID:', authContext?.user?.id);

    if (!authContext?.user?.id) {
      setErrors({
        submit: 'Você precisa estar autenticado para criar um post',
      });
      return;
    }

    try {
      setLoading(true);

      const userId = parseInt(authContext.user.id, 10);
      console.log('🔍 Parsed User ID:', userId);

      const dto: BlogPostCreationDto = {
        title,
        slug,
        excerpt,
        thumbnailUrl,
        content,
        authorId: userId,
        categoryIds: [],
        status: 'PUBLISHED', // Publicar automaticamente
      };

      console.log('🔍 DTO Being Sent:', dto);

      let result: BlogPost;

      if (isEditing && initialPost?.id) {
        result = await BlogService.updatePost(initialPost.id, dto);
      } else {
        result = await BlogService.createPost(dto);
      }

      onSuccess?.(result);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Erro ao publicar',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Metadados Básicos */}
      <div className="bg-card rounded-lg p-6 space-y-4 border border-border">
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Editar Post' : 'Novo Post'}
        </h2>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium mb-2">Título *</label>
          <input
            type="text"
            placeholder="Título do seu post"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground ${
              errors.title ? 'border-destructive' : 'border-border'
            }`}
          />
          {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-2">Slug (URL) *</label>
          <input
            type="text"
            placeholder="titulo-do-seu-post"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground ${
              errors.slug ? 'border-destructive' : 'border-border'
            }`}
          />
          {errors.slug && <p className="text-destructive text-sm mt-1">{errors.slug}</p>}
        </div>

        {/* Grid: Excerpt + Thumbnail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Resumo (máx 500 caracteres)
            </label>
            <textarea
              placeholder="Breve descrição que aparece na lista de posts..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value.substring(0, 500))}
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground h-20 resize-none ${
                errors.excerpt ? 'border-destructive' : 'border-border'
              }`}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {excerpt.length}/500
            </div>
            {errors.excerpt && <p className="text-destructive text-sm mt-1">{errors.excerpt}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL da Imagem Destacada</label>
            <input
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground h-20 ${
                errors.thumbnailUrl ? 'border-destructive' : 'border-border'
              }`}
            />
            {errors.thumbnailUrl && (
              <p className="text-destructive text-sm mt-1">{errors.thumbnailUrl}</p>
            )}
          </div>
        </div>

        {/* Categorias (placeholder) */}
        <div>
          <label className="block text-sm font-medium mb-2">Categorias</label>
          <div className="text-sm text-muted-foreground p-3 border border-dashed rounded-lg">
            Seletor de categorias virá aqui (integração futura)
          </div>
        </div>
      </div>

      {/* Editor Markdown com Preview */}
      <div className="bg-card rounded-lg p-6 border border-border">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1 text-sm border border-border rounded hover:bg-muted"
            >
              {showPreview ? '📖 Mostrar apenas editor' : '👁️ Mostrar preview'}
            </button>
          </div>
          <div className="text-xs text-muted-foreground">
            Suporta Markdown (** negrito **, *itálico*, # títulos, - listas, etc.)
          </div>
        </div>

        {/* Editor + Preview Split View */}
        <div
          className={`grid gap-4 border border-border rounded-lg overflow-hidden ${
            showPreview ? 'grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {/* Editor */}
          <div className="flex flex-col">
            <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">
              ✍️ Markdown
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-4 font-mono text-sm resize-none bg-background text-foreground border-0 focus:outline-none"
              placeholder={`# Seu Título

Seu conteúdo aqui...

## Seção 2
- Ponto 1
- Ponto 2

**Texto em negrito** e *texto em itálico*

> Citação

\`\`\`javascript
// Código aqui
\`\`\`

[Link](https://exemplo.com)`}
            />
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="flex flex-col">
              <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">
                👁️ Preview
              </div>
              <div className="flex-1 overflow-auto p-4 bg-background">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                    components={{
                      h1: (props) => (
                        <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
                      ),
                      h2: (props) => (
                        <h2 className="text-xl font-bold mt-3 mb-2" {...props} />
                      ),
                      h3: (props) => (
                        <h3 className="text-lg font-bold mt-3 mb-2" {...props} />
                      ),
                      p: (props) => <p className="mb-2 leading-relaxed" {...props} />,
                      ul: (props) => <ul className="list-disc list-inside mb-2" {...props} />,
                      ol: (props) => <ol className="list-decimal list-inside mb-2" {...props} />,
                      li: (props) => <li className="mb-1" {...props} />,
                      blockquote: (props) => (
                        <blockquote
                          className="border-l-4 border-primary pl-4 italic my-2"
                          {...props}
                        />
                      ),
                      code: (props) => (
                        <code
                          className="bg-muted px-2 py-1 rounded text-sm font-mono"
                          {...props}
                        />
                      ),
                      pre: (props) => (
                        <pre className="bg-muted p-4 rounded-lg overflow-auto mb-2" {...props} />
                      ),
                      a: (props) => (
                        <a
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {content || '**Preview do seu conteúdo aparecerá aqui...**'}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>

        {errors.content && (
          <p className="text-destructive text-sm mt-2">{errors.content}</p>
        )}
      </div>

      {/* Erros Gerais */}
      {errors.submit && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
          <p className="text-destructive">{errors.submit}</p>
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-3 justify-end bg-card rounded-lg p-6 border border-border">
        <button
          onClick={() => handlePublish()}
          disabled={loading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {loading ? '⏳ Publicando...' : '🚀 Publicar'}
        </button>
      </div>
    </div>
  );
}

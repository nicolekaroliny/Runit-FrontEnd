/* eslint-disable @typescript-eslint/no-explicit-any @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { BlogService } from '@/lib/api/blogservice';
import { CategoryService, BlogCategory } from '@/lib/api/categoryservice';

interface BlogEditorFormData {
  title: string;
  slug: string;
  excerpt: string;
  thumbnailUrl: string;
  content: string;
  categoryIds: number[];
  status: 'DRAFT' | 'PUBLISHED';
}

export default function NewBlogEditorPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [formData, setFormData] = useState<BlogEditorFormData>({
    title: '',
    slug: '',
    excerpt: '',
    thumbnailUrl: '',
    content: '',
    categoryIds: [],
    status: 'PUBLISHED',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug === generateSlug(formData.title) ? generateSlug(value) : prev.slug,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug é obrigatório';
    }
    if (formData.content.trim().length < 100) {
      newErrors.content = 'Conteúdo deve ter pelo menos 100 caracteres';
    }
    if (formData.excerpt.length > 500) {
      newErrors.excerpt = 'Resumo não pode exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const dto = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        thumbnailUrl: formData.thumbnailUrl,
        content: formData.content,
        status: formData.status,
      };

      await BlogService.createPost(dto);
      router.push('/admin/blog');
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : 'Erro ao salvar post',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-foreground">✍️ Novo Post</h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Crie um novo artigo para o blog. Suporta Markdown completo.
        </p>
      </div>

      {/* Error Message */}
      {errors.general && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-200 mb-6 shadow-sm">
          ⚠️ {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Info */}
        <div className="bg-card rounded-xl shadow-md border border-border p-6 space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-border/50">
            <span className="text-2xl">📝</span>
            <h3 className="text-xl font-bold text-foreground">Informações Básicas</h3>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
              Título do Post *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Como começar com React em 2025"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2">❌ {errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
              URL (Slug) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-muted-foreground">🔗</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="como-comeco-react-2025"
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            {errors.slug && (
              <p className="text-red-500 text-sm mt-2">❌ {errors.slug}</p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
              Resumo (até 500 caracteres)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              placeholder="Um resumo atrativo do seu artigo..."
              rows={2}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2 flex justify-between">
              <span>Escreva um resumo atrativo para o seu post</span>
              <span className={formData.excerpt.length > 500 ? 'text-red-500 font-bold' : ''}>
                {formData.excerpt.length}/500
              </span>
            </p>
            {errors.excerpt && (
              <p className="text-red-500 text-sm mt-2">❌ {errors.excerpt}</p>
            )}
          </div>
        </div>

        {/* Section 2: Image & Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
              <span className="text-2xl">🖼️</span>
              <h3 className="text-lg font-bold text-foreground">Imagem de Capa</h3>
            </div>

            <input
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, thumbnailUrl: e.target.value }))
              }
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
            />
            
            {formData.thumbnailUrl && (
              <div className="relative group">
                <img
                  src={formData.thumbnailUrl}
                  alt="Preview"
                  className="w-full h-48 rounded-lg object-cover border border-border shadow-md"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            {!formData.thumbnailUrl && (
              <div className="w-full h-48 rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
                📸 Adicione uma URL de imagem para visualizar
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
              <span className="text-2xl">🏷️</span>
              <h3 className="text-lg font-bold text-foreground">Categorias</h3>
            </div>

            {categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        categoryIds: prev.categoryIds.includes(cat.id)
                          ? prev.categoryIds.filter((id) => id !== cat.id)
                          : [...prev.categoryIds, cat.id],
                      }))
                    }
                    className={`px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 ${
                      formData.categoryIds.includes(cat.id)
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm bg-muted/50 rounded-lg p-3">
                ⚠️ Nenhuma categoria disponível. Crie categorias primeiro.
              </p>
            )}
            {formData.categoryIds.length > 0 && (
              <div className="pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground font-medium">
                  ✅ {formData.categoryIds.length} categoria(s) selecionada(s)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Status */}
        <div className="bg-card rounded-xl shadow-md border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-border/50">
            <span className="text-2xl">📊</span>
            <h3 className="text-lg font-bold text-foreground">Status</h3>
          </div>

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as 'DRAFT' | 'PUBLISHED',
              }))
            }
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
          >
            <option value="DRAFT">📝 Rascunho - Não publicado</option>
            <option value="PUBLISHED">🚀 Publicado - Visível para todos</option>
          </select>
          <p className="text-xs text-muted-foreground">
            {formData.status === 'DRAFT'
              ? '💾 Este post será salvo como rascunho e não aparecerá no blog.'
              : '🌍 Este post será publicado imediatamente no blog.'}
          </p>
        </div>

        {/* Section 4: Content Editor */}
        <div className="bg-card rounded-xl shadow-md border border-border p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✍️</span>
              <h3 className="text-lg font-bold text-foreground">Conteúdo</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-foreground font-medium"
            >
              {showPreview ? '👁️ Esconder' : '👁️ Mostrar'} Preview
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Editor */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                📝 Editor Markdown
              </div>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="# Comece aqui! Digite seu conteúdo em Markdown."
                rows={16}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm resize-none leading-relaxed"
              />
              {errors.content && (
                <p className="text-red-500 text-sm">❌ {errors.content}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.content.length} caracteres • Markdown suportado
              </p>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  👁️ Visualização
                </div>
                <div className="border border-border rounded-lg bg-muted/50 p-4 overflow-auto max-h-96 prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                  >
                    {formData.content || '*(Sua visualização aparecerá aqui)*'}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 -mx-6 px-6">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="px-6 py-2.5 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
          >
            ← Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                Criando...
              </>
            ) : (
              <>
                🚀 Criar Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

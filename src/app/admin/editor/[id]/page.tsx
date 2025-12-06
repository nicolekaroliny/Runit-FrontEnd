/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { use } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { BlogService } from '@/lib/api/blogservice';
import { CategoryService, BlogCategory } from '@/lib/api/categoryservice';
import { BlogPost } from '@/types/blog.types';
import { X } from 'lucide-react';

interface BlogEditorFormData {
  title: string;
  slug: string;
  excerpt: string;
  thumbnailUrl: string;
  content: string;
  categoryIds: number[];
  status: 'DRAFT' | 'PUBLISHED';
}

export default function BlogEditorPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const postId = resolvedParams?.id;
  const isEditing = !!postId;

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
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadPost();
    }
  }, []);

  const loadCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const loadPost = async () => {
    try {
      const post = await BlogService.getPostById(postId!);
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        thumbnailUrl: post.imageUrl || post.thumbnailUrl || '',
        content: post.content,
        categoryIds: (post.categories || []).map((cat: BlogCategory) => cat.id),
        status: (post.status as 'DRAFT' | 'PUBLISHED') || 'PUBLISHED',
      });
    } catch {
      setErrors({ general: 'Erro ao carregar post' });
    } finally {
      setLoading(false);
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

      if (isEditing) {
        await BlogService.updatePost(parseInt(postId!), dto);
      } else {
        await BlogService.createPost(dto);
      }

      router.push('/admin/blog');
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : 'Erro ao salvar post',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">
          {isEditing ? 'Editar Post' : 'Novo Post'}
        </h2>
        <p className="text-muted-foreground mt-1">
          {isEditing ? 'Atualize o conteúdo do seu post' : 'Crie um novo artigo para o blog'}
        </p>
      </div>

      {/* Error Message */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Slug Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Digite o título do post"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="url-do-post"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Resumo (até 500 caracteres)
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
            }
            placeholder="Resumo do artigo"
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.excerpt.length}/500
          </p>
          {errors.excerpt && (
            <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
          )}
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            URL da Imagem
          </label>
          <input
            type="url"
            value={formData.thumbnailUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, thumbnailUrl: e.target.value }))
            }
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formData.thumbnailUrl && (
            <img
              src={formData.thumbnailUrl}
              alt="Preview"
              className="mt-3 max-h-40 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Categorias
          </label>
          <div className="space-y-2">
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
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      formData.categoryIds.includes(cat.id)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:border-primary'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Nenhuma categoria disponível. Crie categorias primeiro.
              </p>
            )}
            {formData.categoryIds.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {formData.categoryIds.length} categoria(s) selecionada(s)
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as 'DRAFT' | 'PUBLISHED',
              }))
            }
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
          </select>
        </div>

        {/* Content Editor */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-foreground">
              Conteúdo (Markdown) *
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80 transition-colors text-foreground"
            >
              {showPreview ? 'Esconder' : 'Mostrar'} Preview
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Editor */}
            <div>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Escreva seu conteúdo em Markdown..."
                rows={15}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-none"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formData.content.length} caracteres
              </p>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="border border-border rounded-lg bg-muted p-4 overflow-auto max-h-96">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                  >
                    {formData.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting
              ? isEditing
                ? 'Atualizando...'
                : 'Criando...'
              : isEditing
                ? 'Atualizar Post'
                : 'Criar Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { BlogService } from '@/lib/api/blogservice';
import { CategoryService, BlogCategory } from '@/lib/api/categoryservice';
import { BlogPost } from '@/types/blog.types';
import { Edit2, Trash2, Plus, Eye, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    thumbnailUrl: string;
    content: string;
    categoryIds: number[];
    status: 'DRAFT' | 'PUBLISHED';
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, categoriesData] = await Promise.all([
        BlogService.getPublishedPosts(0, 100),
        CategoryService.getAllCategories(),
      ]);
      setPosts(postsData.content || []);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post.id);
    setEditFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      thumbnailUrl: post.imageUrl || post.thumbnailUrl || '',
      content: post.content,
      categoryIds: (post.categories || []).map((cat: BlogCategory) => cat.id),
      status: post.status || 'PUBLISHED',
    });
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditFormData(null);
  };

  const handleSaveEdit = async () => {
    if (!editingPost || !editFormData) return;

    try {
      setSubmitting(true);
      await BlogService.updatePost(editingPost, {
        title: editFormData.title,
        slug: editFormData.slug,
        excerpt: editFormData.excerpt,
        thumbnailUrl: editFormData.thumbnailUrl,
        content: editFormData.content,
        status: editFormData.status,
        categoryIds: editFormData.categoryIds,
      });
      await loadData();
      handleCancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setSubmitting(true);
      await BlogService.deletePost(id);
      await loadData();
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar post');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return '-';
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gerenciar Posts</h2>
          <p className="text-muted-foreground mt-1">
            Total: {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
        <Link
          href="/admin/editor"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          <Plus size={20} />
          Novo Post
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-card rounded-lg border border-border shadow-sm overflow-hidden transition-all"
            >
              {/* Post Row */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground mb-1 break-words">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      <code className="bg-muted px-2 py-1 rounded font-mono">
                        {post.slug}
                      </code>
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {/* Categorias */}
                      <div className="flex gap-1 flex-wrap">
                        {post.categories && post.categories.length > 0 ? (
                          post.categories.map((cat: BlogCategory, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                            >
                              {cat.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Sem categorias
                          </span>
                        )}
                      </div>
                      {/* Status */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {post.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                      </span>
                      {/* Data */}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.publicationDate || post.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    <Link
                      href={`/blog/${post.slug || post.id}`}
                      target="_blank"
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors hover:scale-110 active:scale-95"
                      title="Visualizar"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() =>
                        editingPost === post.id
                          ? handleCancelEdit()
                          : handleEdit(post)
                      }
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors hover:scale-110 active:scale-95"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    {deleteConfirm === post.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={submitting}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50 font-medium"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors hover:scale-110 active:scale-95"
                        title="Deletar"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Form - Expandable */}
              {editingPost === post.id && editFormData && (
                <div className="border-t border-border p-4 bg-muted/30 space-y-4">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <ChevronUp size={18} />
                    Editar Post
                  </h4>

                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1 uppercase tracking-wide">
                        Título
                      </label>
                      <input
                        type="text"
                        value={editFormData.title}
                        onChange={(e) =>
                          setEditFormData((prev) => (
                            prev ? { ...prev, title: e.target.value } : null
                          ))
                        }
                        className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1 uppercase tracking-wide">
                        Slug
                      </label>
                      <input
                        type="text"
                        value={editFormData.slug}
                        onChange={(e) =>
                          setEditFormData((prev) => (
                            prev ? { ...prev, slug: e.target.value } : null
                          ))
                        }
                        className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-mono"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1 uppercase tracking-wide">
                      Resumo
                    </label>
                    <textarea
                      value={editFormData.excerpt}
                      onChange={(e) =>
                        setEditFormData((prev) => (
                          prev ? { ...prev, excerpt: e.target.value } : null
                        ))
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                    />
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">
                      Categorias
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() =>
                            setEditFormData((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    categoryIds: prev.categoryIds.includes(cat.id)
                                      ? prev.categoryIds.filter(
                                          (id: number) => id !== cat.id
                                        )
                                      : [...prev.categoryIds, cat.id],
                                  }
                                : null
                            )
                          }
                          className={`px-3 py-1 rounded text-sm transition-all font-medium ${
                            editFormData.categoryIds.includes(cat.id)
                              ? 'bg-primary text-primary-foreground scale-105'
                              : 'bg-muted text-foreground hover:bg-muted/80'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1 uppercase tracking-wide">
                      Status
                    </label>
                    <select
                      value={editFormData.status}
                      onChange={(e) =>
                        setEditFormData((prev) =>
                          prev
                            ? {
                                ...prev,
                                status: e.target.value as 'DRAFT' | 'PUBLISHED',
                              }
                            : null
                        )
                      }
                      className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    >
                      <option value="DRAFT">Rascunho</option>
                      <option value="PUBLISHED">Publicado</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 justify-end pt-3 border-t border-border">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-border rounded text-foreground hover:bg-muted transition-colors font-medium text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={submitting}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity disabled:opacity-50 font-medium text-sm"
                    >
                      {submitting ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-card rounded-lg shadow-md border border-border p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              Nenhum post criado ainda
            </p>
            <Link
              href="/admin/editor"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <Plus size={20} />
              Criar primeiro post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

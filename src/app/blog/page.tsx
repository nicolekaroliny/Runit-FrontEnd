'use client';

import { useState, useEffect } from 'react';
import { BlogService } from '@/lib/api/blogservice';
import { BlogPostCard } from '@/app/components/BlogPostCard';
import { Pagination } from '@/app/components/Pagination';
import { BlogPost, PaginatedResponse } from '@/types/blog.types';

const ITEMS_PER_PAGE = 12;

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts(currentPage - 1);
  }, [currentPage]);

  const fetchPosts = async (page: number) => {
    try {
      setLoading(true);
      const data: PaginatedResponse<BlogPost> = await BlogService.getPublishedPosts(
        page,
        ITEMS_PER_PAGE
      );
      setPosts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar as notícias');
      console.error('Erro ao buscar posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="pt-4 mb-8">
          <h1 className="text-4xl font-bold text-center mb-0" style={{ color: '#C52F33' }}>
            Últimas notícias
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-foreground">Carregando notícias...</p>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-foreground text-lg">Nenhuma notícia encontrada</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

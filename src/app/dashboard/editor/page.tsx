'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BlogEditor } from '@/app/components/BlogEditor';
import { BlogPost } from '@/types/blog.types';

export default function EditorPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  const handleSuccess = (post: BlogPost) => {
    // Redirecionar para o post publicado
    router.push(`/blog/${post.slug || post.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 pt-32">
        <BlogEditor onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

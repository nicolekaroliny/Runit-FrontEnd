'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { performGoogleLogin } from '@/lib/auth';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Extrai os parâmetros da URL
        const token = searchParams.get('token');
        const id = searchParams.get('id');
        const name = searchParams.get('name');
        const lastName = searchParams.get('lastName');
        const email = searchParams.get('email');
        const role = searchParams.get('role');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          throw new Error(decodeURIComponent(errorParam));
        }

        if (!token) {
          throw new Error('Nenhum token recebido do servidor');
        }

        console.log('✅ Dados recebidos do callback:', { 
          temToken: !!token, 
          email,
          role 
        });

        // Faz login usando os dados recebidos
        const result = await performGoogleLogin({
          token,
          id: parseInt(id || '0'),
          name: decodeURIComponent(name || ''),
          lastName: decodeURIComponent(lastName || ''),
          email: decodeURIComponent(email || ''),
          user_type: (role || '').toLowerCase() === 'admin' ? 'admin' : 
                     (role || '').toLowerCase() === 'editor' ? 'editor' : 'user',
        });

        if (!result.success) {
          throw new Error(result.message || 'Erro ao processar autenticação do Google');
        }

        console.log('✅ Login com Google bem-sucedido!');

        // Redireciona para o dashboard após login bem-sucedido
        router.push('/');
      } catch (err) {
        console.error('❌ Erro ao processar callback:', err);
        setError(err instanceof Error ? err.message : 'Erro ao processar autenticação com Google');
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, router]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-card">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-foreground font-semibold">Processando autenticação...</p>
          <p className="text-muted-foreground text-sm mt-2">Por favor aguarde</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-card p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Erro na Autenticação</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <a 
            href="/signin"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Voltar para Login
          </a>
        </div>
      </div>
    );
  }

  return null;
}

import { ReactNode } from 'react';
import { ChevronLeft, Calendar, User } from 'lucide-react';
// Importação de Next.js Links omitida para evitar erros de compilação em ambientes restritos.

// --- CONFIGURAÇÃO DA API (ATUALIZE ESTA CONSTANTE) ---
// Substitua pela URL da sua API Spring Boot
const API_URL = 'http://localhost:8080/api/v1'; 

// --- Interfaces de Dados do Post (Simulam o DTO de Back-end) ---

interface UserSimpleResponseDto {
  id: string;
  name: string;
  avatarUrl: string;
}

interface BlogPostDetailResponseDto {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string; // Conteúdo completo (geralmente em Markdown/HTML)
  coverImageUrl: string;
  publicationDate: string; // ISO Date string
  author: UserSimpleResponseDto;
}

// --- FUNÇÃO DE BUSCA REAL (Modificada para usar 'fetch') ---
async function getPostDetail(slug: string): Promise<BlogPostDetailResponseDto | null> {
  const endpoint = `${API_URL}/blog/posts/${slug}`; // Exemplo de endpoint: GET /api/v1/blog/posts/o-slug-do-post
  
  try {
    const response = await fetch(endpoint, {
      // Adicione headers, cache, ou outras configurações conforme a sua API
      next: { revalidate: 60 }, // Revalida a cada 60 segundos (para server components)
    });

    if (!response.ok) {
      // Se o backend retornar 404 (Not Found)
      if (response.status === 404) {
        console.warn(`Postagem não encontrada para o slug: ${slug}`);
        return null; 
      }
      // Outros erros de servidor
      throw new Error(`Erro ao buscar o post: ${response.statusText}`);
    }

    const post: BlogPostDetailResponseDto = await response.json();
    return post;

  } catch (error) {
    console.error(`Falha na comunicação com a API em ${endpoint}:`, error);
    // Em caso de erro de rede ou servidor, retorna null para exibir a mensagem de erro no frontend
    return null; 
  }
}

// Componente para formatação do corpo do texto.
const ContentRenderer = ({ htmlContent }: { htmlContent: string }) => {
  return (
    <div
      // Usando 'prose prose-invert' para estilizar o HTML injetado
      className="prose prose-invert max-w-none text-muted-foreground leading-relaxed"
      // Usando o recurso para renderizar o HTML da string 'content'
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    ></div>
  );
};

// Componente Principal da Página
// O parâmetro 'params' contém o slug extraído da URL (ex: /blog/meu-post-slug)
export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostDetail(params.slug);

  if (!post) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <div className="text-center p-8 bg-card rounded-xl shadow-lg border border-border">
                <h1 className="text-3xl font-bold mb-4">Postagem Não Encontrada</h1>
                <p className="text-muted-foreground mb-6">Não foi possível carregar o artigo com o slug "{params.slug}".</p>
                <a href="/blog" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Voltar para o Blog
                </a>
            </div>
        </div>
    );
  }

  const formattedDate = new Date(post.publicationDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Botão Voltar para a página de listagem */}
        <a href="/blog" className="inline-flex items-center text-primary hover:text-primary-foreground transition-colors mb-8">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Voltar para o Blog
        </a>

        {/* Imagem de Capa */}
        <img
          src={post.coverImageUrl}
          alt={`Capa para ${post.title}`}
          className="w-full h-auto object-cover rounded-xl shadow-lg mb-8"
        />

        {/* Cabeçalho do Post */}
        <header className="mb-10 border-b border-border pb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>
          {/* O subtítulo é opcional, dependendo do DTO */}
          {post.subtitle && (
            <p className="text-xl text-muted-foreground italic mb-6">
              {post.subtitle}
            </p>
          )}
          
          {/* Metadados */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1 text-primary" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-primary" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </header>

        {/* Conteúdo do Post */}
        <section className="mb-12">
          <ContentRenderer htmlContent={post.content} />
        </section>

        {/* Rodapé removido! */}
        
      </div>
    </div>
  );
}
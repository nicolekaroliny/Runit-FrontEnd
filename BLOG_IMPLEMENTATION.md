# Blog System Implementation

## Mudanças Realizadas

### 📄 Páginas Criadas

#### 1. `/blog` (Lista de Notícias)
- **Arquivo**: `src/app/blog/page.tsx`
- Exibe todas as notícias publicadas em um grid responsivo
- Grid de 1 coluna (mobile), 2 colunas (tablet), 3 colunas (desktop)
- Paginação automática com 12 posts por página
- Componentes reutilizáveis para melhor manutenção

#### 2. `/blog/[id]` (Página Individual do Post)
- **Arquivo**: `src/app/blog/[id]/page.tsx`
- Exibe o conteúdo completo de um post específico
- Imagem destacada, categoria, data de publicação
- Link para voltar à lista de notícias
- Tratamento de erros para posts não encontrados

### 🔧 Componentes Criados

#### `BlogPostCard` 
- **Arquivo**: `src/app/components/BlogPostCard.tsx`
- Card reutilizável para exibir um post na lista
- Imagem com efeito de hover (zoom)
- Badge de categoria
- Título, excerpt e data
- Responsivo e acessível

#### `Pagination`
- **Arquivo**: `src/app/components/Pagination.tsx`
- Componente de paginação reutilizável
- Botões anterior/próxima
- Números de página inteligentes (mostra ... quando necessário)
- Suporta estado de carregamento
- Acessibilidade completa

### 📚 Serviços e Tipos

#### `BlogService`
- **Arquivo**: `src/lib/api/blogservice.ts`
- Centraliza todas as chamadas à API de blog
- Métodos:
  - `getPublishedPosts(page, size)` - Posts com paginação
  - `getPostById(id)` - Post específico
  - `getPostsByCategory(slug, page, size)` - Posts por categoria
  - `searchPosts(query, page, size)` - Busca de posts

#### `blog.types.ts`
- **Arquivo**: `src/types/blog.types.ts`
- Interfaces TypeScript para tipagem completa:
  - `BlogPost` - Estrutura de um post
  - `BlogCategory` - Estrutura de uma categoria
  - `PaginatedResponse<T>` - Resposta paginada genérica

## Estilos Utilizados

- **Tailwind CSS** para layout responsivo
- **CSS Variables** do `globals.css` para cores:
  - `--color-background` - Fundo principal
  - `--color-card` - Fundo dos cards
  - `--color-primary` - Cor primária (links, botões ativos)
  - `--color-muted-foreground` - Texto secundário
  - E outros...

### Classes Importantes

- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` - Grid responsivo
- `bg-card` e `text-card-foreground` - Estilo dos cards
- `hover:shadow-lg transition-shadow` - Efeitos de interação
- `line-clamp-2` - Limita texto a 2 linhas
- `group` e `group-hover:` - Efeitos de grupo

## Como Usar

### Acessar a página de blog
```
http://localhost:3000/blog
```

### Acessar um post específico
```
http://localhost:3000/blog/1
http://localhost:3000/blog/meu-slug-do-post
```

### Variáveis de Ambiente
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Funcionalidades

✅ Listagem de notícias com paginação
✅ Página individual para cada post
✅ Grid responsivo (mobile, tablet, desktop)
✅ Efeitos de interação (hover, transitions)
✅ Tratamento de erros
✅ Estado de carregamento
✅ Badges de categoria
✅ Formatação de datas
✅ Navegação entre páginas suave (smooth scroll)
✅ Acessibilidade completa (ARIA labels)

## API Esperada

O backend deve ter os seguintes endpoints:

### GET `/api/blog/posts`
Query params:
- `page` - Número da página (0-indexed)
- `size` - Quantidade de posts por página

Resposta:
```json
{
  "content": [
    {
      "id": 1,
      "title": "Título do Post",
      "excerpt": "Resumo do post...",
      "content": "Conteúdo completo...",
      "imageUrl": "https://...",
      "category": "Notícias",
      "createdAt": "2025-12-05T10:00:00Z",
      "slug": "titulo-do-post"
    }
  ],
  "totalPages": 10,
  "totalElements": 120,
  "currentPage": 0,
  "pageSize": 12,
  "last": false,
  "first": true
}
```

### GET `/api/blog/posts/{id}`
Resposta: Um objeto `BlogPost` completo

## Próximos Passos (Opcionais)

- [ ] Adicionar filtro por categoria
- [ ] Adicionar busca de posts
- [ ] Adicionar comentários em posts
- [ ] Adicionar "posts relacionados"
- [ ] Adicionar compartilhamento em redes sociais
- [ ] Implementar cache de posts
- [ ] Adicionar análise de leitura (tempo estimado)

## 🚀 Guia de Integração do Sistema de Blog

Parabéns! O sistema de blog foi implementado com sucesso. Aqui está como usá-lo:

### 📋 O que foi criado

#### Páginas:
- `src/app/blog/page.tsx` - Lista de notícias com paginação
- `src/app/blog/[id]/page.tsx` - Página individual do post

#### Componentes:
- `src/app/components/BlogPostCard.tsx` - Card de um post
- `src/app/components/Pagination.tsx` - Componente de paginação

#### Serviços:
- `src/lib/api/blogservice.ts` - Chamadas à API
- `src/types/blog.types.ts` - Tipos TypeScript

### ✅ Checklist de Integração

- [ ] Verificar se a API do backend está rodando em `http://localhost:8080`
- [ ] Verificar se o endpoint `/api/blog/posts` retorna uma resposta paginada
- [ ] Testar a página em `http://localhost:3000/blog`
- [ ] Verificar se as imagens carregam corretamente
- [ ] Testar a paginação
- [ ] Testar acesso a um post individual em `/blog/1`

### 🔌 Configuração da API

A aplicação espera que a variável de ambiente `NEXT_PUBLIC_API_URL` aponte para o backend:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 📱 Responsividade

O design é completamente responsivo:
- **Mobile**: 1 coluna
- **Tablet**: 2 colunas
- **Desktop**: 3 colunas

### 🎨 Cores Utilizadas

A página utiliza as cores do seu `globals.css`:
- Background: Cor de fundo principal
- Cards: Cor de fundo dos cartões
- Primary: Cor primária (#1E5AA8 light / #539cf7 dark)
- Text: Cores de texto baseadas no tema

### 🔴 Cor do Título

O título "Últimas notícias" usa a cor específica `#C52F33` (vermelho) como mencionado no exemplo.

### 📊 Estrutura da Resposta da API

A API deve retornar uma resposta com paginação:

```json
{
  "content": [...],
  "totalPages": 10,
  "totalElements": 120,
  "currentPage": 0,
  "pageSize": 12,
  "last": false,
  "first": true
}
```

Ou simplesmente um array se não usar paginação no backend:

```json
[
  {
    "id": 1,
    "title": "...",
    "excerpt": "...",
    "content": "...",
    "imageUrl": "...",
    "category": "...",
    "createdAt": "2025-12-05T...",
    "slug": "..."
  }
]
```

### 🐛 Troubleshooting

**Problema**: Nenhuma notícia aparece
- Verifique se o backend está rodando
- Verifique se há posts publicados no banco de dados
- Abra o console do navegador (F12) para ver erros

**Problema**: Imagens não carregam
- Verifique se as URLs das imagens são válidas
- O sistema usa placeholder se a URL estiver vazia

**Problema**: Paginação não funciona
- Verifique se o backend retorna `totalPages`
- Verifique o console para erros de API

### 🎯 Próximos Passos

1. **Filtros por Categoria**
   - Adicionar links de categoria na página
   - Usar `BlogService.getPostsByCategory()`

2. **Busca de Posts**
   - Adicionar campo de busca
   - Usar `BlogService.searchPosts()`

3. **Posts Relacionados**
   - Exibir 3 posts aleatórios na página individual
   - Usar `BlogService.getPublishedPosts()` com limite

4. **Compartilhamento**
   - Adicionar botões de compartilhamento em redes sociais
   - Meta tags para Open Graph

### 📚 Exemplos de Uso

#### Chamar um post específico:
```typescript
import { BlogService } from '@/lib/api/blogservice';

const post = await BlogService.getPostById(1);
```

#### Buscar posts com paginação:
```typescript
const response = await BlogService.getPublishedPosts(0, 12);
console.log(response.content); // Array de posts
console.log(response.totalPages); // Número total de páginas
```

### 🎨 Customização de Estilos

Todos os estilos usam classes Tailwind e CSS variables. Para customizar:

1. **Cores**: Edite `src/app/globals.css`
2. **Layout**: Edite as classes Tailwind nos componentes
3. **Efeitos**: Modifique transições e animações em `globals.css`

---

**Status**: ✅ Pronto para testar!

Execute `npm run dev` e visite `http://localhost:3000/blog`

#!/bin/bash

# 📰 Sistema de Blog - Quick Start Guide
# Execute este script para verificar se tudo está configurado

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║         🚀 SISTEMA DE BLOG - VERIFICAÇÃO RÁPIDA             ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar arquivo
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
  else
    echo -e "${RED}✗${NC} $1 (NÃO ENCONTRADO)"
  fi
}

# Função para verificar diretório
check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1/"
  else
    echo -e "${RED}✗${NC} $1/ (NÃO ENCONTRADO)"
  fi
}

echo -e "${BLUE}📁 Verificando Arquivos Criados...${NC}"
echo ""

echo "Páginas:"
check_file "src/app/blog/page.tsx"
check_file "src/app/blog/[id]/page.tsx"
echo ""

echo "Componentes:"
check_file "src/app/components/BlogPostCard.tsx"
check_file "src/app/components/Pagination.tsx"
echo ""

echo "Serviços e Tipos:"
check_file "src/lib/api/blogservice.ts"
check_file "src/types/blog.types.ts"
echo ""

echo "Mocks e Testes:"
check_file "src/lib/mocks/blog-mock.ts"
echo ""

echo "Documentação:"
check_file "BLOG_IMPLEMENTATION.md"
check_file "BLOG_SETUP.md"
check_file "BLOG_ARCHITECTURE.md"
check_file "BLOG_SUMMARY.md"
echo ""

echo -e "${BLUE}🔧 Próximos Passos...${NC}"
echo ""

echo "1. Iniciar o backend:"
echo "   cd RunUnit-BackEnd/rununit"
echo "   ./gradlew bootRun"
echo ""

echo "2. Verificar API disponível:"
echo "   curl http://localhost:8080/api/blog/posts"
echo ""

echo "3. Iniciar frontend:"
echo "   cd Runit-FrontEnd"
echo "   npm install (se necessário)"
echo "   npm run dev"
echo ""

echo "4. Acessar no navegador:"
echo -e "   ${BLUE}http://localhost:3000/blog${NC}"
echo ""

echo -e "${YELLOW}⚙️  Configuração da API${NC}"
echo ""
echo "Certifique-se de que .env.local tem:"
echo "   NEXT_PUBLIC_API_URL=http://localhost:8080"
echo ""

echo -e "${GREEN}✨ Tudo pronto! Divirta-se com o novo blog! 🎉${NC}"
echo ""

#!/bin/bash

# Script para testar endpoints de autenticação
# Use: bash test_auth.sh

API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:8080}/api"
echo "🔍 Testando API em: $API_URL"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Testar Signup
echo -e "${YELLOW}1. Testando POST /auth/register${NC}"
echo "----------------------------------------"

SIGNUP_DATA='{
  "name": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "testpass123",
  "birthDate": "1990-01-01",
  "gender": "M",
  "timezone": "America/Sao_Paulo",
  "locale": "pt_BR"
}'

echo "Request:"
echo "$SIGNUP_DATA" | jq '.'
echo ""

SIGNUP_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "$SIGNUP_DATA")

echo "Response:"
echo "$SIGNUP_RESPONSE" | jq '.'
echo ""

# Extrair token se sucesso
TOKEN=$(echo "$SIGNUP_RESPONSE" | jq -r '.token // empty')
if [ -z "$TOKEN" ]; then
  echo -e "${YELLOW}⚠️  Signup failed ou email já existe (esperado)${NC}"
else
  echo -e "${GREEN}✅ Signup Success! Token: ${TOKEN:0:50}...${NC}"
fi
echo ""

# 2. Testar Login
echo -e "${YELLOW}2. Testando POST /auth/login${NC}"
echo "----------------------------------------"

LOGIN_DATA='{
  "email": "test@example.com",
  "password": "testpass123"
}'

echo "Request:"
echo "$LOGIN_DATA" | jq '.'
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA")

echo "Response:"
echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Extrair token se sucesso
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')
if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed${NC}"
else
  echo -e "${GREEN}✅ Login Success! Token: ${TOKEN:0:50}...${NC}"
fi
echo ""

# 3. Testar Login com credenciais inválidas
echo -e "${YELLOW}3. Testando Login com credenciais inválidas${NC}"
echo "----------------------------------------"

INVALID_LOGIN='{
  "email": "test@example.com",
  "password": "wrongpassword"
}'

echo "Request:"
echo "$INVALID_LOGIN" | jq '.'
echo ""

INVALID_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "$INVALID_LOGIN")

echo "Response (deve conter erro):"
echo "$INVALID_RESPONSE" | jq '.'
echo ""

# 4. Status final
echo -e "${YELLOW}4. Resumo${NC}"
echo "----------------------------------------"
echo "Se os testes acima retornarem:"
echo -e "${GREEN}✅ Status 200 com 'token' e 'id'${NC} → Backend está OK!"
echo -e "${RED}❌ Erros de conexão${NC} → Backend não está rodando em $API_URL"
echo -e "${YELLOW}⚠️  Email já existe${NC} → Esperado em segunda execução"
echo ""

echo "🔍 Próximas etapas:"
echo "1. Iniciar frontend: npm run dev"
echo "2. Acessar http://localhost:3000/signup"
echo "3. Preencher formulário e cadastrar"
echo "4. Verificar DevTools → Application → LocalStorage"
echo ""

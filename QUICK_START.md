# 🏃‍♂️ Runit Frontend - Guia de Início Rápido

## ✅ Status de Implementação

- ✅ **Autenticação**: Login, Signup, Logout integrados
- ✅ **Contexto**: `useAuth()` hook disponível globalmente
- ✅ **Formulários**: 2-step signup, login funcional
- ✅ **Proteção**: Middleware protege rotas autenticadas
- ✅ **Ambiente**: `.env.local` configurado com fallback
- ✅ **Erros**: Tratamento específico de HTTP 400, 401, 409
- ⏳ **Backend**: Aguardando servidor em `http://localhost:8080`

---

## 🚀 Iniciar o Projeto

### Pré-requisitos

```bash
# Node.js 18+ e npm/yarn/pnpm
node --version  # v18.0.0+
npm --version   # 8.0.0+
```

### 1. Instalar Dependências

```bash
cd /home/caiogbrayner/Desktop/UnitJava/Runit-FrontEnd
npm install
```

### 2. Configurar Backend URL (opcional)

Editar `.env.local`:

```env
# Padrão: http://localhost:8080
# Se backend está em outra porta:
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Iniciar Frontend

```bash
npm run dev
```

Abrir: `http://localhost:3000`

---

## 🧪 Testar Autenticação

### Opção 1: Interface Web

1. **Signup**: `http://localhost:3000/signup`
   - Etapa 1: Nome, Sobrenome, Email
   - Etapa 2: Data nascimento, Gênero, Senha, Timezone, Idioma
   - Clique "Cadastrar"

2. **Login**: `http://localhost:3000/signin`
   - Email: seu@email.com
   - Senha: sua_senha
   - Clique "Entrar"

3. **Dashboard**: `http://localhost:3000/dashboard`
   - Após login, redireciona automaticamente
   - (Página ainda não implementada - será criado um erro)

4. **Logout**: Botão "Sair" no header
   - Volta para `/signin`

### Opção 2: API Tests (curl)

```bash
# Teste com script bash
bash test_auth.sh

# Ou manualmente:

# Signup
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "lastName": "Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "birthDate": "1990-01-01",
    "gender": "M",
    "timezone": "America/Sao_Paulo",
    "locale": "pt_BR"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Opção 3: DevTools

1. Abrir DevTools (`F12`)
2. Ir para **Application** → **LocalStorage** → `http://localhost:3000`
3. Verificar:
   - `token`: JWT com formato `eyJ...`
   - `currentUser`: JSON com `id`, `name`, `email`, `user_type`

---

## 🔍 Verificar Integração

### 1. Confirmar que Backend está acessível

```bash
# Terminal
curl http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

Se não funcionar:
- ❌ Backend não está rodando → Iniciar backend
- ❌ Porta errada → Verificar `.env.local`

### 2. Verificar FormData sendo enviada

```javascript
// DevTools → Console
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('currentUser'));
console.log({token, user});
```

Deve mostrar:
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: {
    id: "1",
    name: "João",
    email: "joao@example.com",
    user_type: "user"
  }
}
```

### 3. Verificar Network Requests

DevTools → **Network** → Fazer login

Procurar por:
- `POST /api/auth/login` → Status **200**
- Response: `{ token, id, name, email, role }`

---

## 📋 Estrutura do Projeto

```
Runit-FrontEnd/
├── .env.local                       ← API_URL configurado
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── signin/
│   │   │   │   └── page.tsx         ← Tela de Login
│   │   │   └── signup/
│   │   │       └── page.tsx         ← Tela de Registro (2 steps)
│   │   ├── globals.css              ← Design tokens
│   │   └── layout.tsx               ← AuthProvider wrapper
│   ├── context/
│   │   └── authcontext.tsx          ← useAuth() hook
│   ├── lib/
│   │   ├── api/
│   │   │   └── authservice.ts       ← Fetch API
│   │   └── auth.ts                  ← Helpers (login, register, logout)
│   ├── ui/
│   │   ├── loginform.tsx            ← Componente de Login
│   │   ├── signupform.tsx           ← Componente de Registro
│   │   ├── logoutbutton.tsx         ← Botão de Logout
│   │   └── ...componentes
│   └── middleware.ts                ← Proteção de rotas
├── AUTHENTICATION_INTEGRATION.md    ← Documentação técnica
└── test_auth.sh                     ← Script de testes
```

---

## 🐛 Troubleshooting

### Erro: "Servidor não está disponível"

```
Causa: Backend não está rodando em http://localhost:8080
Solução:
1. Iniciar backend no terminal
2. Verificar porta em .env.local
3. Verificar CORS no backend
```

### Erro: "Email ou senha inválidos" mas credenciais estão corretas

```
Causa: Backend rejeitando por validação
Solução:
1. Verificar console do backend para erro detalhado
2. Verificar formato de dados (birthDate: "YYYY-MM-DD")
3. Verificar validação de senha (min 8 chars)
```

### Token não está sendo salvo

```
Causa: Erro na resposta do backend
Solução:
1. DevTools → Network → Ver resposta completa
2. Verificar que response tem campos: token, id, name, email, role
3. Verificar Content-Type da resposta (deve ser application/json)
```

### Redireciona infinitamente

```
Causa: Middleware matando requests
Solução:
1. Verificar localStorage está setado corretamente
2. Verificar token não está expirado
3. Limpar cache: DevTools → Application → Clear Storage
```

---

## 📝 Próximas Etapas

### Tarefas Imediatas:
1. [ ] Testes com backend rodando
2. [ ] Criar página `/dashboard` (placeholder)
3. [ ] Ajustar redirecionamentos por role (admin vs user)

### Melhorias Futuras:
1. [ ] Implementar refresh token
2. [ ] Adicionar Google OAuth
3. [ ] Adicionar WebAuthn/Biometric
4. [ ] Página "Esqueceu Senha"
5. [ ] Tests com Jest
6. [ ] Rate limiting

---

## 📚 Documentação Relacionada

- **Integração Detalhada**: `AUTHENTICATION_INTEGRATION.md`
- **Backend Guide**: Fornecido separadamente
- **Next.js Docs**: https://nextjs.org/docs
- **React Hooks**: https://react.dev/reference/react/hooks

---

## 💡 Dicas de Debug

### Ver todos os logs de autenticação

```javascript
// DevTools → Console
localStorage.getItem('token')
localStorage.getItem('currentUser')
// + Logs do browser que mostram 🔍, ✅, ❌
```

### Testar diretamente a API

```bash
# Ver se backend responde
curl -v http://localhost:8080/api/auth/login

# Verificar CORS
curl -i -X OPTIONS http://localhost:8080/api/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"
```

### Resetar estado de autenticação

```javascript
// DevTools → Console
localStorage.clear()
location.reload()
// Redireciona para /signin
```

---

## 🎯 Checklist de Teste

- [ ] Backend rodando em `http://localhost:8080`
- [ ] Frontend rodando em `http://localhost:3000`
- [ ] Conseguir fazer signup com novo email
- [ ] Token salvo em localStorage após signup
- [ ] Redireciona para `/dashboard` após signup
- [ ] Conseguir fazer login com credenciais
- [ ] Token salvo em localStorage após login
- [ ] Botão logout funciona
- [ ] Logout redireciona para `/signin`
- [ ] Erro ao tentar acessar `/dashboard` sem auth

---

## 📞 Suporte

Para debug rápido, verificar:
1. Console do navegador (DevTools) → Errors/Warnings
2. Network tab → Status HTTP das requests
3. LocalStorage → Token e user data
4. Terminal do backend → Logs de erro

---

**Última atualização**: Contexto de autenticação completo e integrado
**Versão**: 1.0.0
**Status**: Pronto para teste com backend

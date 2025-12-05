## 🚀 Guia Rápido - Testar Login

### 1️⃣ Pré-requisitos
- [ ] Backend rodando em `http://localhost:8080`
- [ ] Frontend em `http://localhost:3000`
- [ ] DevTools aberto (F12)

### 2️⃣ Iniciar Frontend
```bash
cd /home/caiogbrayner/Desktop/UnitJava/Runit-FrontEnd
npm run dev
```

### 3️⃣ Fazer Login
1. Ir para `http://localhost:3000/signin`
2. Entrar com:
   - **Email**: `admin@test.com`
   - **Senha**: `sua_senha`
3. Clicar "Entrar"

### 4️⃣ Verificar Logs
**DevTools → Console** deve mostrar:
```
📝 Tentando login com email: admin@test.com
🔐 performLogin: Iniciando login para admin@test.com
🔐 performLogin: Resposta recebida: {token: ✓, id: 1, ...}
✅ Token armazenado em localStorage
✅ Login bem-sucedido! Redirecionando para dashboard...
```

### 5️⃣ Verificar AuthDebug Widget
**Canto inferior direito** deve mostrar:
```
isLoading: false
isAuthenticated: true
user: Admin (admin@test.com)
token: eyJhbGciOi...
```

### 6️⃣ Verificar Dashboard
- Deve estar em `/dashboard`
- Mostrando nome, email, id do usuário
- Token (truncado) para debug

### 7️⃣ Verificar LocalStorage
**DevTools → Application → LocalStorage → http://localhost:3000**
- `token`: JWT (começa com `eyJ`)
- `currentUser`: JSON com dados do usuário

---

## ❌ Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Não redireciona | Verificar logs - procurar por `❌` |
| Hydration error | Limpar cache: `Ctrl+Shift+Delete` |
| AuthDebug não aparece | Recarregar page (F5) |
| Token não salvo | Verificar console for `✅ Token armazenado` |
| Login button travado | Verificar Network tab for erro no backend |

---

## 📊 Checklist Final

- [ ] Build passou (`npm run build`)
- [ ] Sem erros de TypeScript
- [ ] Sem hydration mismatch
- [ ] Frontend inicia (`npm run dev`)
- [ ] Login page carrega
- [ ] Logs aparecem no console
- [ ] Token é armazenado
- [ ] AuthDebug widget visível
- [ ] Redireciona para dashboard
- [ ] Dashboard mostra informações
- [ ] Logout funciona

---

**Se tudo passou ✅**: Autenticação está funcionando!

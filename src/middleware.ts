import { NextRequest, NextResponse } from 'next/server';

const AUTH_ROUTES = ['/signin', '/signup'];
const PROTECTED_ROUTES = ['/dashboard', '/home', '/perfil', '/configuracoes'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Verificar se existe token no cookies
  const token = request.cookies.get('token')?.value;

  // Se a rota é protegida e não tem token, redireciona para signin
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!token) {
      console.log(`🔒 Middleware: Rota protegida ${pathname} acessada sem token - redirecionando para /signin`);
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // Se está autenticado e tenta acessar auth routes, redireciona para dashboard
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (token) {
      console.log(`🔒 Middleware: Usuário autenticado tentou acessar ${pathname} - redirecionando para /dashboard`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

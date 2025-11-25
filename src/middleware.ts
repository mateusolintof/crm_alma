import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

/**
 * Rotas públicas que não requerem autenticação
 */
const PUBLIC_ROUTES = ['/login'];

/**
 * Middleware de autenticação e CSRF
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Ignorar arquivos estáticos e APIs
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') // arquivos estáticos (favicon.ico, etc)
    ) {
        return NextResponse.next();
    }

    // Verificar token de autenticação
    const token = request.cookies.get('auth-token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const isAuthenticated = !!payload;

    // Rota de login
    if (PUBLIC_ROUTES.includes(pathname)) {
        // Se já autenticado, redirecionar para dashboard
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/inbox', request.url));
        }
        return NextResponse.next();
    }

    // Rotas protegidas - requer autenticação
    if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        // Adicionar URL de retorno para redirecionar após login
        loginUrl.searchParams.set('returnUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Usuário autenticado - garantir CSRF token
    const response = NextResponse.next();
    const hasCsrf = request.cookies.get('csrf-token')?.value;
    
    if (!hasCsrf) {
        const csrfToken = crypto.randomUUID();
        response.cookies.set('csrf-token', csrfToken, {
            httpOnly: false, // Precisa ser acessível pelo JavaScript
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 horas
        });
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};

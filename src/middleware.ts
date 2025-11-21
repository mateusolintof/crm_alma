import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow all API routes (handled by route handlers) except auth already public
    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Public routes
    if (pathname === '/login' || pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    // Protected routes (everything else except static files)
    if (
        !pathname.startsWith('/_next') &&
        !pathname.startsWith('/favicon.ico') &&
        !pathname.startsWith('/public')
    ) {
        const token = request.cookies.get('auth-token')?.value;
        const payload = token ? await verifyToken(token) : null;

        if (!payload) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        const response = NextResponse.next();
        const hasCsrf = request.cookies.get('csrf-token')?.value;
        if (!hasCsrf) {
            const csrfToken = crypto.randomUUID();
            response.cookies.set('csrf-token', csrfToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24,
            });
        }
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

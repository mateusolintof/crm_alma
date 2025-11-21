import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

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
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

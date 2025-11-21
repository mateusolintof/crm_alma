import { cookies } from 'next/headers';

export const CSRF_COOKIE_NAME = 'csrf-token';

const cookieOptions = {
    httpOnly: false, // double-submit cookie must be readable by client
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 24h
};

export function createCsrfToken() {
    // uuid is fine for CSRF token randomness
    return crypto.randomUUID();
}

export async function ensureCsrfCookie(token?: string) {
    const store = await cookies();
    const existing = store.get(CSRF_COOKIE_NAME)?.value;
    const value = token || existing || createCsrfToken();
    store.set(CSRF_COOKIE_NAME, value, cookieOptions);
    return value;
}

export async function assertCsrf(request: Request): Promise<void> {
    const headerToken = request.headers.get('x-csrf-token');
    const cookieToken = (await cookies()).get(CSRF_COOKIE_NAME)?.value;
    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
        throw new Error('Invalid CSRF token');
    }
}

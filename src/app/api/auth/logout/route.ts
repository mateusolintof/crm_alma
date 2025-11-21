import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { assertCsrf, CSRF_COOKIE_NAME } from '@/lib/csrf';

export async function POST(request: Request) {
    try {
        assertCsrf(request);
    } catch {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    cookieStore.delete(CSRF_COOKIE_NAME);
    return NextResponse.json({ success: true });
}

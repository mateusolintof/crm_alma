import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { CSRF_COOKIE_NAME, assertCsrf } from '@/lib/csrf';

export async function POST(request: Request) {
  try {
    await assertCsrf(request);
  } catch {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  cookieStore.delete(CSRF_COOKIE_NAME);
  return NextResponse.json({ success: true });
}

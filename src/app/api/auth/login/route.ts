import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
        include: { tenant: true }
    });

    if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    // Note: In a real app, we would have hashed passwords in the DB.
    // For this MVP/Seed data, we might have plain text or need to handle the seed.
    // Let's assume the seed created hashed passwords or we check plain text if verify fails (for dev convenience if seed was plain).

    let isValid = false;
    // Check if password looks like a bcrypt hash (starts with $2)
    if (user.password.startsWith('$2')) {
        isValid = await verifyPassword(password, user.password);
    } else if (process.env.NODE_ENV !== 'production') {
        // Fallback for plain text seed data (common in dev seeds)
        isValid = password === user.password;
    }

    if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session
    const token = await signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        tenantDomain: user.tenant.domain,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ success: true, user: { email: user.email, name: user.name } });
}

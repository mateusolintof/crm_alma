import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const SECRET_KEY_SOURCE =
    process.env.NODE_ENV === 'production'
        ? process.env.JWT_SECRET
        : process.env.JWT_SECRET || 'development_secret_key_change_in_prod';

if (process.env.NODE_ENV === 'production' && !SECRET_KEY_SOURCE) {
    throw new Error('JWT_SECRET is required in production');
}

const resolvedSecret = SECRET_KEY_SOURCE ?? 'development_secret_key_change_in_prod';

const key = new TextEncoder().encode(resolvedSecret);

export interface AuthPayload extends JWTPayload {
    userId: string;
    email: string;
    role: string;
    tenantId: string;
    tenantDomain?: string;
}

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export async function signToken(payload: AuthPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify<AuthPayload>(token, key);
        return payload;
    } catch {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

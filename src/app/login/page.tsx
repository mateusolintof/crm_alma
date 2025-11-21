'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/inbox');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Falha no login');
            }
        } catch {
            setError('Ocorreu um erro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-app)',
            fontFamily: 'var(--font-sans)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 20px 50px rgba(15,23,42,0.12)',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>Alma CRM</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Entre na sua conta</p>
                </div>

                {error && (
                    <div style={{
                        padding: '12px',
                        background: 'rgba(255, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 0, 0, 0.2)',
                        color: '#ff4444',
                        borderRadius: '6px',
                        marginBottom: '20px',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#666' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    background: 'var(--bg-surface-2)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '10px',
                                    color: 'var(--text-strong)',
                                    outline: 'none'
                                }}
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Senha</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#666' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    background: 'var(--bg-surface-2)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '10px',
                                    color: 'var(--text-strong)',
                                    outline: 'none'
                                }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '12px' }}
                    >
                        {loading ? 'Entrando...' : 'Acessar Sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
}

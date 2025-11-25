'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Layout para páginas de autenticação (login, registro, etc.)
 * NÃO inclui a Sidebar - apenas o conteúdo da página
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Verificar se já está autenticado e redirecionar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se existe cookie de autenticação
        const res = await fetch('/api/auth/me', { method: 'GET' });
        if (res.ok) {
          // Já está logado, redirecionar para inbox
          router.push('/inbox');
        }
      } catch {
        // Não autenticado, permanecer na página
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-app via-white to-primary-subtle/30">
      {children}
    </div>
  );
}


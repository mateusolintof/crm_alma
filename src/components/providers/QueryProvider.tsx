'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: dados ficam "fresh" por 30 segundos
            staleTime: 30 * 1000,
            // Cache time: dados mantidos em cache por 5 minutos
            gcTime: 5 * 60 * 1000,
            // Retry 1 vez em caso de erro
            retry: 1,
            // Refetch quando a janela ganha foco
            refetchOnWindowFocus: true,
            // Não refetch no mount se os dados estão fresh
            refetchOnMount: true,
          },
          mutations: {
            // Retry 0 vezes para mutations
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}


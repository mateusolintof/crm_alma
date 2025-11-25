import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Tenant } from '@/types';

interface AuthState {
  // Estado
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Ações
  setUser: (user: User | null) => void;
  setTenant: (tenant: Tenant | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      tenant: null,
      isAuthenticated: false,
      isLoading: true,

      // Setters
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTenant: (tenant) => set({ tenant }),

      // Login
      login: async (email: string, password: string) => {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (res.ok) {
            const data = await res.json();
            set({
              user: data.user,
              tenant: data.tenant,
              isAuthenticated: true,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      // Logout
      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            tenant: null,
            isAuthenticated: false,
          });
        }
      },

      // Verificar autenticação
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const data = await res.json();
            set({
              user: data.user,
              tenant: data.tenant,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              tenant: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch {
          set({
            user: null,
            tenant: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'alma-auth',
      partialize: (state) => ({
        // Apenas persistir dados não sensíveis
        tenant: state.tenant,
      }),
    }
  )
);

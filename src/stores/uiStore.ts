import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Toast } from '@/types';

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Modals
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  openModal: (modalId: string, data?: Record<string, unknown> | null) => void;
  closeModal: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;

  // Command Palette
  commandPaletteOpen: boolean;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;

  // Loading states globais
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

// Gerar ID único para toasts
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // --- Sidebar ---
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // --- Modals ---
      activeModal: null,
      modalData: null,
      openModal: (modalId, data = null) => set({ activeModal: modalId, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),

      // --- Toasts ---
      toasts: [],
      showToast: (toast) => {
        const id = generateId();
        const newToast: Toast = {
          id,
          duration: 5000, // 5 segundos padrão
          ...toast,
        };

        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));

        // Auto-dismiss
        if (newToast.duration && newToast.duration > 0) {
          setTimeout(() => {
            get().dismissToast(id);
          }, newToast.duration);
        }
      },
      dismissToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
      clearToasts: () => set({ toasts: [] }),

      // --- Command Palette ---
      commandPaletteOpen: false,
      toggleCommandPalette: () =>
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      // --- Global Loading ---
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
    }),
    {
      name: 'alma-ui',
      partialize: (state) => ({
        // Apenas persistir preferências
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

// Helper hooks para facilitar uso
export const useToast = () => {
  const showToast = useUIStore((state) => state.showToast);

  return {
    success: (title: string, message?: string) => showToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => showToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) => showToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) => showToast({ type: 'info', title, message }),
  };
};

'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { useUIStore } from '@/stores/uiStore';
import type { Toast as ToastType } from '@/types';

// ============================================
// Toast Item
// ============================================

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

const styles = {
  success: 'bg-success-bg border-success/20 text-success',
  error: 'bg-danger-bg border-danger/20 text-danger',
  warning: 'bg-warning-bg border-warning/20 text-warning',
  info: 'bg-info-bg border-info/20 text-info',
} as const;

interface ToastItemProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = icons[toast.type];

  return (
    <div
      role="alert"
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-up',
        'bg-white border-bg-border'
      )}
    >
      <div className={clsx('flex-shrink-0 p-1 rounded-full', styles[toast.type])}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text-primary text-sm">{toast.title}</p>
        {toast.message && (
          <p className="mt-0.5 text-sm text-text-secondary">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors"
        aria-label="Fechar notificação"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// ============================================
// Toast Container
// ============================================

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);
  const dismissToast = useUIStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notificações"
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={dismissToast} />
        </div>
      ))}
    </div>
  );
}

// ============================================
// Standalone Toast (para uso fora do contexto)
// ============================================

export interface StandaloneToastProps {
  type: ToastType['type'];
  title: string;
  message?: string;
  visible: boolean;
  onClose: () => void;
}

export function StandaloneToast({
  type,
  title,
  message,
  visible,
  onClose,
}: StandaloneToastProps) {
  const Icon = icons[type];

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className={clsx(
        'fixed bottom-4 right-4 z-[100] flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        'bg-white border-bg-border animate-slide-up max-w-sm'
      )}
    >
      <div className={clsx('flex-shrink-0 p-1 rounded-full', styles[type])}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text-primary text-sm">{title}</p>
        {message && (
          <p className="mt-0.5 text-sm text-text-secondary">{message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors"
        aria-label="Fechar notificação"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default ToastContainer;


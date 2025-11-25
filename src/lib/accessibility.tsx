/**
 * Utilitários de acessibilidade para o Alma CRM
 *
 * Este módulo contém helpers para melhorar a acessibilidade do sistema:
 * - Gerenciamento de foco
 * - Navegação por teclado
 * - Screen reader helpers
 */
import React from 'react';

// ============================================
// FOCUS MANAGEMENT
// ============================================

/**
 * Move o foco para um elemento de forma segura
 */
export function focusElement(element: HTMLElement | null) {
  if (element && typeof element.focus === 'function') {
    // Pequeno delay para garantir que o elemento está renderizado
    requestAnimationFrame(() => {
      element.focus();
    });
  }
}

/**
 * Trap de foco dentro de um container (para modals)
 */
export function trapFocus(container: HTMLElement) {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  // Retorna função para remover o listener
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Obtém todos os elementos focáveis dentro de um container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

/**
 * Salva e restaura foco (útil para modals)
 */
export function saveFocus(): () => void {
  const previouslyFocused = document.activeElement as HTMLElement;

  return () => {
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }
  };
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

/**
 * Keys comuns para navegação
 */
export const Keys = {
  Enter: 'Enter',
  Space: ' ',
  Escape: 'Escape',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Home: 'Home',
  End: 'End',
  Tab: 'Tab',
} as const;

/**
 * Hook helper para navegação em lista com teclado
 */
export function handleListNavigation(
  event: React.KeyboardEvent,
  currentIndex: number,
  totalItems: number,
  onSelect: (index: number) => void,
  onActivate?: (index: number) => void,
) {
  let newIndex = currentIndex;

  switch (event.key) {
    case Keys.ArrowDown:
      event.preventDefault();
      newIndex = (currentIndex + 1) % totalItems;
      break;
    case Keys.ArrowUp:
      event.preventDefault();
      newIndex = (currentIndex - 1 + totalItems) % totalItems;
      break;
    case Keys.Home:
      event.preventDefault();
      newIndex = 0;
      break;
    case Keys.End:
      event.preventDefault();
      newIndex = totalItems - 1;
      break;
    case Keys.Enter:
    case Keys.Space:
      event.preventDefault();
      onActivate?.(currentIndex);
      return;
    default:
      return;
  }

  onSelect(newIndex);
}

// ============================================
// ARIA HELPERS
// ============================================

/**
 * Gera ID único para associações aria-labelledby/aria-describedby
 */
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Props para elementos de status (loading, error, etc)
 */
export function getStatusAriaProps(status: 'loading' | 'error' | 'success' | 'idle') {
  return {
    'aria-busy': status === 'loading',
    'aria-invalid': status === 'error',
    'aria-live': status === 'error' ? ('assertive' as const) : ('polite' as const),
  };
}

/**
 * Props para elementos de seleção
 */
export function getSelectionAriaProps(isSelected: boolean, isDisabled: boolean = false) {
  return {
    'aria-selected': isSelected,
    'aria-disabled': isDisabled,
    tabIndex: isDisabled ? -1 : 0,
  };
}

// ============================================
// SCREEN READER UTILITIES
// ============================================

/**
 * Classe para conteúdo apenas para screen readers
 */
export const visuallyHiddenStyles: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/**
 * Componente para texto apenas para screen readers
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span style={visuallyHiddenStyles}>{children}</span>;
}

/**
 * Anuncia uma mensagem para screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite',
) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.cssText =
    'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';

  document.body.appendChild(announcement);

  // Pequeno delay para garantir que o elemento foi inserido
  setTimeout(() => {
    announcement.textContent = message;

    // Remove após um tempo
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, 100);
}

// ============================================
// REDUCED MOTION
// ============================================

/**
 * Verifica se o usuário prefere movimento reduzido
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Hook para detectar preferência de movimento reduzido
 */
export function usePrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

// ============================================
// SKIP LINKS
// ============================================

/**
 * Props para skip link de navegação
 */
export function getSkipLinkProps(targetId: string) {
  return {
    href: `#${targetId}`,
    className:
      'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md',
    'aria-label': 'Pular para conteúdo principal',
  };
}

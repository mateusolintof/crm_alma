'use client';

import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  delayMs?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delayMs = 300,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delayMs);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let x = 0;
      let y = 0;

      // Posição vertical
      switch (side) {
        case 'top':
          y = -tooltipRect.height - 8;
          break;
        case 'bottom':
          y = triggerRect.height + 8;
          break;
        case 'left':
          x = -tooltipRect.width - 8;
          y = (triggerRect.height - tooltipRect.height) / 2;
          break;
        case 'right':
          x = triggerRect.width + 8;
          y = (triggerRect.height - tooltipRect.height) / 2;
          break;
      }

      // Alinhamento horizontal (para top/bottom)
      if (side === 'top' || side === 'bottom') {
        switch (align) {
          case 'start':
            x = 0;
            break;
          case 'center':
            x = (triggerRect.width - tooltipRect.width) / 2;
            break;
          case 'end':
            x = triggerRect.width - tooltipRect.width;
            break;
        }
      }

      setPosition({ x, y });
    }
  }, [visible, side, align]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={clsx(
            'absolute z-50 px-2.5 py-1.5 text-xs font-medium',
            'bg-slate-900 text-white rounded-md shadow-lg',
            'whitespace-nowrap animate-fade-in',
            className
          )}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          {content}
          {/* Arrow */}
          <div
            className={clsx(
              'absolute w-2 h-2 bg-slate-900 rotate-45',
              side === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
              side === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
              side === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
              side === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2'
            )}
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// Keyboard Shortcut - para mostrar atalhos
// ============================================

export interface KeyboardShortcutProps {
  keys: string[];
  className?: string;
}

export function KeyboardShortcut({ keys, className }: KeyboardShortcutProps) {
  return (
    <span className={clsx('inline-flex items-center gap-0.5', className)}>
      {keys.map((key, index) => (
        <kbd
          key={index}
          className={clsx(
            'inline-flex items-center justify-center',
            'min-w-[20px] h-5 px-1.5',
            'text-[10px] font-medium text-text-tertiary',
            'bg-bg-hover border border-bg-border rounded',
            'font-mono'
          )}
        >
          {key}
        </kbd>
      ))}
    </span>
  );
}

export default Tooltip;


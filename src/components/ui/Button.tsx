'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

// Variantes de botão
const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-sm hover:shadow-md',
  secondary:
    'bg-white text-text-primary border border-bg-border hover:bg-bg-hover hover:border-bg-border-hover',
  ghost:
    'bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary',
  danger:
    'bg-danger text-white hover:bg-danger-hover active:bg-danger-active shadow-sm hover:shadow-md',
  'danger-ghost':
    'bg-transparent text-danger hover:bg-danger-bg',
  success:
    'bg-success text-white hover:bg-success-hover active:bg-success-active shadow-sm hover:shadow-md',
} as const;

// Tamanhos
const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-10 px-5 text-sm gap-2',
  xl: 'h-11 px-6 text-base gap-2.5',
  icon: 'h-9 w-9 p-0',
  'icon-sm': 'h-8 w-8 p-0',
  'icon-lg': 'h-10 w-10 p-0',
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isIconOnly = size.startsWith('icon');
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          // Base
          'inline-flex items-center justify-center font-medium rounded-md',
          'transition-all duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          // Hover lift effect
          'hover:-translate-y-0.5 active:translate-y-0',
          // Variantes
          variants[variant],
          sizes[size],
          // Estados
          isDisabled && 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-sm',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {!isIconOnly && children && <span className="ml-2">{children}</span>}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && !isIconOnly && icon}
            {isIconOnly ? icon : children}
            {icon && iconPosition === 'right' && !isIconOnly && icon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

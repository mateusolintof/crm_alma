'use client';

import { clsx } from 'clsx';

import { HTMLAttributes, forwardRef } from 'react';

// ============================================
// Card Container
// ============================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'glass';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variants = {
  default: 'bg-white border border-bg-border',
  outlined: 'bg-transparent border border-bg-border',
  elevated: 'bg-white border border-bg-border shadow-md',
  glass: 'bg-white/80 backdrop-blur-sm border border-bg-border shadow-glass',
} as const;

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
} as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', hoverable = false, padding = 'md', className, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg',
          variants[variant],
          paddings[padding],
          hoverable &&
            'transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

// ============================================
// Card Header
// ============================================

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div className={clsx('flex items-start justify-between gap-4', className)} {...props}>
      {title || subtitle ? (
        <div className="min-w-0 flex-1">
          {title && <h3 className="font-semibold text-text-primary truncate">{title}</h3>}
          {subtitle && <p className="text-sm text-text-tertiary mt-0.5 truncate">{subtitle}</p>}
        </div>
      ) : (
        children
      )}
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ============================================
// Card Content
// ============================================

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={clsx('mt-4', className)} {...props}>
      {children}
    </div>
  );
}

// ============================================
// Card Footer
// ============================================

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  border?: boolean;
}

export function CardFooter({ border = true, className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={clsx(
        'mt-4 pt-4 flex items-center gap-3',
        border && 'border-t border-bg-border',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================
// Stat Card - para métricas
// ============================================

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, className }: StatCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-tertiary">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
          {trend && (
            <p
              className={clsx(
                'mt-2 text-sm font-medium',
                trend.value >= 0 ? 'text-success' : 'text-danger',
              )}
            >
              {trend.value >= 0 ? '+' : ''}
              {trend.value}%
              {trend.label && <span className="text-text-tertiary ml-1">{trend.label}</span>}
            </p>
          )}
        </div>
        {icon && <div className="p-2 bg-primary-subtle rounded-lg text-primary">{icon}</div>}
      </div>
    </Card>
  );
}

export default Card;

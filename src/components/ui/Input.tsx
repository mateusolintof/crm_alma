'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx';

// Base styles compartilhados
const baseStyles = clsx(
  'w-full rounded-md border bg-white text-text-primary placeholder:text-text-tertiary',
  'transition-all duration-150',
  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-hover'
);

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-3 text-sm',
  lg: 'h-10 px-4 text-sm',
  xl: 'h-11 px-4 text-base',
} as const;

// ============================================
// Input Text
// ============================================

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: keyof typeof sizes;
  error?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      error = false,
      icon,
      iconPosition = 'left',
      className,
      ...props
    },
    ref
  ) => {
    const hasIcon = !!icon;

    if (hasIcon) {
      return (
        <div className="relative">
          {iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              baseStyles,
              sizes[size],
              error ? 'border-danger focus:ring-danger' : 'border-bg-border',
              iconPosition === 'left' && 'pl-10',
              iconPosition === 'right' && 'pr-10',
              className
            )}
            {...props}
          />
          {iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-tertiary">
              {icon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={clsx(
          baseStyles,
          sizes[size],
          error ? 'border-danger focus:ring-danger' : 'border-bg-border',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

// ============================================
// Textarea
// ============================================

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          baseStyles,
          'min-h-[80px] py-2 px-3 text-sm resize-y',
          error ? 'border-danger focus:ring-danger' : 'border-bg-border',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

// ============================================
// Search Input
// ============================================

import { Search, X } from 'lucide-react';

export interface SearchInputProps extends Omit<InputProps, 'icon' | 'iconPosition' | 'size'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, className, ...props }, ref) => {
    const showClear = value && String(value).length > 0 && onClear;

    // Remover qualquer 'size' que possa estar nos props para evitar conflito com o atributo HTML
    const { size: _size, ...restProps } = props as { size?: unknown };

    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">
          <Search size={16} />
        </div>
        <input
          ref={ref}
          type="text"
          value={value}
          className={clsx(
            baseStyles,
            sizes.md,
            'pl-9',
            showClear && 'pr-9',
            'border-bg-border',
            className
          )}
          {...restProps}
        />
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

// ============================================
// Select
// ============================================

import { ChevronDown } from 'lucide-react';

export interface SelectProps extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: keyof typeof sizes;
  error?: boolean;
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ size = 'md', error = false, className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={clsx(
            baseStyles,
            sizes[size],
            'appearance-none pr-10 cursor-pointer',
            error ? 'border-danger focus:ring-danger' : 'border-bg-border',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-tertiary">
          <ChevronDown size={16} />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

// ============================================
// Form Field (Label + Input + Error)
// ============================================

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, required, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-text-tertiary">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  );
}

export default Input;


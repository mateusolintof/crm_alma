'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';

// ============================================
// Dropdown Menu
// ============================================

export interface DropdownItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  selectedId?: string;
  align?: 'left' | 'right';
  width?: 'auto' | 'trigger' | number;
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  onSelect,
  selectedId,
  align = 'left',
  width = 'auto',
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>();

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // Fechar com ESC
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open]);

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;
    onSelect(item);
    setOpen(false);
  };

  const computeMenuWidth = () => {
    if (width === 'auto') return undefined;
    if (width === 'trigger') return triggerRef.current?.offsetWidth;
    return typeof width === 'number' ? width : undefined;
  };

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (!prev) {
        setMenuWidth(computeMenuWidth());
      }
      return next;
    });
  };

  return (
    <div ref={dropdownRef} className={clsx('relative', className)}>
      {/* Trigger */}
      <div ref={triggerRef} onClick={toggleOpen}>
        {trigger}
      </div>

      {/* Menu */}
      {open && (
        <div
          className={clsx(
            'absolute top-full mt-1 z-50',
            'bg-white border border-bg-border rounded-lg shadow-lg',
            'py-1 min-w-[180px] animate-scale-in',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          style={{ width: menuWidth }}
        >
          {items.map((item, index) => (
            <Fragment key={item.id}>
              {item.divider && index > 0 && (
                <div className="my-1 border-t border-bg-border" />
              )}
              <button
                onClick={() => handleSelect(item)}
                disabled={item.disabled}
                className={clsx(
                  'w-full px-3 py-2 text-left text-sm transition-colors',
                  'flex items-center gap-2',
                  item.disabled && 'opacity-50 cursor-not-allowed',
                  item.danger
                    ? 'text-danger hover:bg-danger-bg'
                    : 'text-text-primary hover:bg-bg-hover',
                  selectedId === item.id && 'bg-bg-hover'
                )}
              >
                {item.icon && (
                  <span className="flex-shrink-0 text-text-tertiary">
                    {item.icon}
                  </span>
                )}
                <span className="flex-1 min-w-0">
                  <span className="block truncate">{item.label}</span>
                  {item.description && (
                    <span className="block text-xs text-text-tertiary truncate">
                      {item.description}
                    </span>
                  )}
                </span>
                {selectedId === item.id && (
                  <Check size={16} className="flex-shrink-0 text-primary" />
                )}
              </button>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// Select Dropdown - para seleção única
// ============================================

export interface SelectDropdownOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectDropdownProps {
  value: string | undefined;
  onChange: (value: string) => void;
  options: SelectDropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function SelectDropdown({
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  disabled = false,
  error = false,
  className,
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={dropdownRef} className={clsx('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={clsx(
          'w-full h-9 px-3 text-sm text-left',
          'flex items-center justify-between gap-2',
          'bg-white border rounded-md transition-all',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          disabled && 'opacity-50 cursor-not-allowed bg-bg-hover',
          error ? 'border-danger' : 'border-bg-border hover:border-bg-border-hover'
        )}
      >
        <span
          className={clsx(
            'flex-1 truncate',
            selectedOption ? 'text-text-primary' : 'text-text-tertiary'
          )}
        >
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={clsx(
            'flex-shrink-0 text-text-tertiary transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {/* Options List */}
      {open && (
        <div
          className={clsx(
            'absolute top-full left-0 right-0 mt-1 z-50',
            'bg-white border border-bg-border rounded-lg shadow-lg',
            'py-1 max-h-60 overflow-y-auto animate-scale-in'
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                if (!option.disabled) {
                  onChange(option.value);
                  setOpen(false);
                }
              }}
              disabled={option.disabled}
              className={clsx(
                'w-full px-3 py-2 text-left text-sm transition-colors',
                'flex items-center gap-2',
                option.disabled && 'opacity-50 cursor-not-allowed',
                option.value === value
                  ? 'bg-primary-subtle text-primary'
                  : 'text-text-primary hover:bg-bg-hover'
              )}
            >
              {option.icon && (
                <span className="flex-shrink-0">{option.icon}</span>
              )}
              <span className="flex-1 min-w-0">
                <span className="block truncate">{option.label}</span>
                {option.description && (
                  <span className="block text-xs text-text-tertiary truncate">
                    {option.description}
                  </span>
                )}
              </span>
              {option.value === value && (
                <Check size={16} className="flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;

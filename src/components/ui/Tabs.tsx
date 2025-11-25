'use client';

import { createContext, useContext, useState } from 'react';
import { clsx } from 'clsx';

// ============================================
// Context
// ============================================

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
}

// ============================================
// Tabs Container
// ============================================

export interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
  className?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ defaultTab, children, className, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// ============================================
// Tab List
// ============================================

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

export function TabList({ children, className, variant = 'default' }: TabListProps) {
  const baseStyles = {
    default: 'flex gap-1 p-1 bg-bg-hover rounded-lg',
    pills: 'flex gap-2',
    underline: 'flex gap-6 border-b border-bg-border',
  };

  return (
    <div role="tablist" className={clsx(baseStyles[variant], className)}>
      {children}
    </div>
  );
}

// ============================================
// Tab Trigger
// ============================================

export interface TabTriggerProps {
  id: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

export function TabTrigger({
  id,
  children,
  icon,
  badge,
  disabled = false,
  className,
  variant = 'default',
}: TabTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === id;

  const baseStyles = {
    default: clsx(
      'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all',
      isActive
        ? 'bg-white text-text-primary shadow-sm'
        : 'text-text-secondary hover:text-text-primary',
      disabled && 'opacity-50 cursor-not-allowed'
    ),
    pills: clsx(
      'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all',
      isActive
        ? 'bg-primary text-white'
        : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary',
      disabled && 'opacity-50 cursor-not-allowed'
    ),
    underline: clsx(
      'flex items-center gap-2 px-1 pb-3 text-sm font-medium border-b-2 -mb-px transition-all',
      isActive
        ? 'border-primary text-primary'
        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-bg-border',
      disabled && 'opacity-50 cursor-not-allowed'
    ),
  };

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      id={`tab-${id}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(id)}
      className={clsx(baseStyles[variant], className)}
    >
      {icon}
      {children}
      {badge !== undefined && (
        <span
          className={clsx(
            'ml-1 px-1.5 py-0.5 text-xs rounded-full',
            isActive
              ? variant === 'pills'
                ? 'bg-white/20 text-white'
                : 'bg-primary-subtle text-primary'
              : 'bg-bg-border text-text-tertiary'
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// ============================================
// Tab Content
// ============================================

export interface TabContentProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function TabContent({ id, children, className }: TabContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== id) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      className={clsx('animate-fade-in', className)}
    >
      {children}
    </div>
  );
}

export default Tabs;


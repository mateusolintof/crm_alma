'use client';

import { clsx } from 'clsx';

import React from 'react';

interface ListPageProps {
  title: string;
  subtitle?: string;
  count?: number;
  searchSlot?: React.ReactNode;
  actions?: React.ReactNode;
  isLoading?: boolean;
  loadingState?: React.ReactNode;
  hasData: boolean;
  hasResults: boolean;
  isSearching: boolean;
  error?: boolean;
  errorState?: React.ReactNode;
  emptyState: React.ReactNode;
  emptySearchState?: React.ReactNode;
  children: React.ReactNode;
}

export function ListPage({
  title,
  subtitle,
  count,
  searchSlot,
  actions,
  isLoading,
  loadingState,
  hasData,
  hasResults,
  isSearching,
  error,
  errorState,
  emptyState,
  emptySearchState,
  children,
}: ListPageProps) {
  const showEmptySearch = isSearching && !hasResults;

  let content = children;

  if (isLoading && loadingState) {
    content = loadingState;
  } else if (error && errorState) {
    content = errorState;
  } else if (!hasData) {
    content = emptyState;
  } else if (showEmptySearch && emptySearchState) {
    content = emptySearchState;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
          {(subtitle || count !== undefined) && (
            <p
              className={clsx(
                'text-sm text-text-secondary mt-1',
                !subtitle && 'text-text-tertiary',
              )}
            >
              {subtitle ?? `${count} ${count === 1 ? 'item' : 'itens'}`}
            </p>
          )}
        </div>
        {(searchSlot || actions) && (
          <div className="flex items-center gap-3">
            {searchSlot}
            {actions}
          </div>
        )}
      </div>

      {content}
    </div>
  );
}

export default ListPage;

'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

// ============================================
// Base Skeleton
// ============================================

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseStyles = 'bg-bg-border';
  
  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  return (
    <div
      className={clsx(
        baseStyles,
        animationStyles[animation],
        variantStyles[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

// ============================================
// Skeleton Text
// ============================================

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '75%' : '100%'}
        />
      ))}
    </div>
  );
}

// ============================================
// Skeleton Avatar
// ============================================

export interface SkeletonAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export function SkeletonAvatar({ size = 'md', className }: SkeletonAvatarProps) {
  return (
    <Skeleton
      variant="circular"
      className={clsx(avatarSizes[size], className)}
    />
  );
}

// ============================================
// Skeleton Card
// ============================================

export interface SkeletonCardProps {
  hasAvatar?: boolean;
  hasImage?: boolean;
  lines?: number;
  className?: string;
}

export function SkeletonCard({
  hasAvatar = true,
  hasImage = false,
  lines = 2,
  className,
}: SkeletonCardProps) {
  return (
    <div
      className={clsx(
        'bg-white border border-bg-border rounded-lg p-4 space-y-4',
        className
      )}
    >
      {hasImage && (
        <Skeleton variant="rounded" height={160} className="w-full" />
      )}
      
      <div className="flex items-center gap-3">
        {hasAvatar && <SkeletonAvatar size="lg" />}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>

      {lines > 0 && <SkeletonText lines={lines} />}
    </div>
  );
}

// ============================================
// Skeleton Table
// ============================================

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
}: SkeletonTableProps) {
  return (
    <div className={clsx('bg-white border border-bg-border rounded-lg overflow-hidden', className)}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center gap-4 p-4 border-b border-bg-border bg-bg-app">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="text" className="flex-1" height={16} />
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="divide-y divide-bg-border">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 p-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                variant="text"
                className="flex-1"
                width={colIndex === 0 ? '40%' : undefined}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Skeleton List
// ============================================

export interface SkeletonListProps {
  items?: number;
  hasAvatar?: boolean;
  className?: string;
}

export function SkeletonList({
  items = 5,
  hasAvatar = true,
  className,
}: SkeletonListProps) {
  return (
    <div className={clsx('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-4 bg-white border border-bg-border rounded-lg"
        >
          {hasAvatar && <SkeletonAvatar size="lg" />}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="30%" />
          </div>
          <Skeleton variant="rounded" width={80} height={28} />
        </div>
      ))}
    </div>
  );
}

// ============================================
// Skeleton Kanban
// ============================================

export interface SkeletonKanbanProps {
  columns?: number;
  cardsPerColumn?: number;
  className?: string;
}

export function SkeletonKanban({
  columns = 4,
  cardsPerColumn = 3,
  className,
}: SkeletonKanbanProps) {
  return (
    <div className={clsx('flex gap-5', className)}>
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div key={colIndex} className="min-w-320 w-80">
          {/* Column Header */}
          <div className="flex items-center justify-between py-3 px-1">
            <Skeleton variant="text" width={120} height={16} />
            <Skeleton variant="rounded" width={28} height={20} />
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="bg-white border border-bg-border rounded-lg p-4 space-y-3"
              >
                <Skeleton variant="text" width="80%" height={18} />
                <div className="flex items-center gap-2">
                  <Skeleton variant="text" width={60} height={14} />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-bg-border">
                  <Skeleton variant="text" width={100} height={14} />
                  <Skeleton variant="rounded" width={50} height={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Skeleton Inbox
// ============================================

export function SkeletonInbox() {
  const [bubbleWidths] = useState(() =>
    Array.from({ length: 4 }).map(() => 200 + Math.random() * 100)
  );

  return (
    <div className="flex h-screen">
      {/* Conversation List */}
      <div className="w-80 border-r border-bg-border bg-white">
        <div className="p-4 border-b border-bg-border space-y-3">
          <Skeleton variant="text" width={80} height={24} />
          <Skeleton variant="rounded" height={36} className="w-full" />
          <div className="flex gap-2">
            <Skeleton variant="rounded" height={32} className="flex-1" />
            <Skeleton variant="rounded" height={32} className="flex-1" />
            <Skeleton variant="rounded" height={32} className="flex-1" />
          </div>
        </div>
        <div className="divide-y divide-bg-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex gap-3">
              <SkeletonAvatar size="lg" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width={40} />
                </div>
                <Skeleton variant="text" width="80%" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-50 flex flex-col">
        <div className="h-16 px-6 border-b border-bg-border bg-white flex items-center gap-3">
          <SkeletonAvatar />
          <div className="space-y-1">
            <Skeleton variant="text" width={120} />
            <Skeleton variant="text" width={80} />
          </div>
        </div>
        <div className="flex-1 p-6 space-y-4">
          {bubbleWidths.map((width, i) => (
            <div
              key={i}
              className={clsx(
                'flex',
                i % 2 === 0 ? 'justify-start' : 'justify-end'
              )}
            >
              <Skeleton
                variant="rounded"
                width={width}
                height={60}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skeleton;

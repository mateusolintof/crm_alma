'use client';

import { clsx } from 'clsx';

import Image from 'next/image';

const sizes = {
  xs: 'w-6 h-6 text-2xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
} as const;

const shapes = {
  circle: 'rounded-full',
  square: 'rounded-lg',
} as const;

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: keyof typeof sizes;
  shape?: keyof typeof shapes;
  className?: string;
}

// Função para gerar cores baseadas no nome
function getAvatarColor(name: string): string {
  const colors = [
    'from-primary/20 to-primary-hover/10 text-primary border-primary-border',
    'from-success/20 to-success-hover/10 text-success border-success-bg',
    'from-warning/20 to-warning/10 text-warning border-warning-bg',
    'from-danger/15 to-danger-hover/10 text-danger border-danger-bg',
    'from-info/20 to-info/10 text-info border-info-bg',
    'from-bg-hover to-bg-border text-text-secondary border-bg-border',
    'from-text-tertiary/10 to-bg-hover text-text-primary border-bg-border',
    'from-text-primary/5 to-bg-hover text-text-secondary border-bg-border',
  ];

  // Gerar índice baseado no nome
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

// Função para obter iniciais
function getInitials(name: string): string {
  if (!name) return '?';

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ src, name = '', size = 'md', shape = 'circle', className }: AvatarProps) {
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  if (src) {
    return (
      <div
        className={clsx(
          'relative overflow-hidden flex-shrink-0',
          sizes[size],
          shapes[shape],
          className,
        )}
      >
        <Image src={src} alt={name || 'Avatar'} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex items-center justify-center font-semibold flex-shrink-0',
        'bg-gradient-to-br border',
        sizes[size],
        shapes[shape],
        colorClass,
        className,
      )}
    >
      {initials}
    </div>
  );
}

// ============================================
// Avatar Group - para exibir múltiplos avatares
// ============================================

export interface AvatarGroupProps {
  avatars: Array<{ src?: string | null; name: string }>;
  max?: number;
  size?: keyof typeof sizes;
  className?: string;
}

export function AvatarGroup({ avatars, max = 4, size = 'sm', className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={clsx('flex -space-x-2', className)}>
      {visible.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={clsx(
            'flex items-center justify-center font-semibold flex-shrink-0',
            'bg-bg-hover text-text-secondary border border-bg-border rounded-full ring-2 ring-white',
            sizes[size],
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

export default Avatar;

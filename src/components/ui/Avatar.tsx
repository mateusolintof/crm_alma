'use client';

import { clsx } from 'clsx';
import Image from 'next/image';

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
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
    'from-blue-500/20 to-blue-600/10 text-blue-600 border-blue-200',
    'from-emerald-500/20 to-emerald-600/10 text-emerald-600 border-emerald-200',
    'from-purple-500/20 to-purple-600/10 text-purple-600 border-purple-200',
    'from-amber-500/20 to-amber-600/10 text-amber-600 border-amber-200',
    'from-rose-500/20 to-rose-600/10 text-rose-600 border-rose-200',
    'from-cyan-500/20 to-cyan-600/10 text-cyan-600 border-cyan-200',
    'from-indigo-500/20 to-indigo-600/10 text-indigo-600 border-indigo-200',
    'from-orange-500/20 to-orange-600/10 text-orange-600 border-orange-200',
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

export function Avatar({
  src,
  name = '',
  size = 'md',
  shape = 'circle',
  className,
}: AvatarProps) {
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  if (src) {
    return (
      <div
        className={clsx(
          'relative overflow-hidden flex-shrink-0',
          sizes[size],
          shapes[shape],
          className
        )}
      >
        <Image
          src={src}
          alt={name || 'Avatar'}
          fill
          className="object-cover"
        />
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
        className
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

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'sm',
  className,
}: AvatarGroupProps) {
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
            sizes[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

export default Avatar;


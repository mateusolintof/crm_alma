'use client';

import { clsx } from 'clsx';

// Variantes de cor
const variants = {
  default: 'bg-bg-hover text-text-secondary border-bg-border',
  primary: 'bg-primary-subtle text-primary border-primary-border',
  success: 'bg-success-bg text-success border-success/20',
  warning: 'bg-warning-bg text-warning border-warning/20',
  danger: 'bg-danger-bg text-danger border-danger/20',
  info: 'bg-info-bg text-info border-info/20',
} as const;

// Tamanhos
const sizes = {
  sm: 'text-2xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-xs px-2.5 py-1',
} as const;

export interface BadgeProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'danger' && 'bg-danger',
            variant === 'info' && 'bg-info',
            variant === 'primary' && 'bg-primary',
            variant === 'default' && 'bg-text-tertiary'
          )}
        />
      )}
      {children}
    </span>
  );
}

// ============================================
// Status Badge - para status comuns
// ============================================

const statusMap = {
  // Lead Status
  NEW: { variant: 'info' as const, label: 'Novo' },
  CONTACTED: { variant: 'warning' as const, label: 'Contatado' },
  QUALIFIED: { variant: 'success' as const, label: 'Qualificado' },
  LOST: { variant: 'danger' as const, label: 'Perdido' },
  
  // Deal Status
  OPEN: { variant: 'info' as const, label: 'Aberto' },
  WON: { variant: 'success' as const, label: 'Ganho' },
  
  // Conversation Status
  CLOSED: { variant: 'default' as const, label: 'Fechado' },
  ARCHIVED: { variant: 'default' as const, label: 'Arquivado' },
} as const;

export interface StatusBadgeProps {
  status: keyof typeof statusMap;
  size?: keyof typeof sizes;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ status, size = 'md', dot = true, className }: StatusBadgeProps) {
  const config = statusMap[status] || { variant: 'default', label: status };
  
  return (
    <Badge variant={config.variant} size={size} dot={dot} className={className}>
      {config.label}
    </Badge>
  );
}

// ============================================
// Channel Badge - para canais de comunicação
// ============================================

import { MessageSquare, Mail, Instagram, Phone, Globe } from 'lucide-react';

const channelMap = {
  WHATSAPP: {
    icon: MessageSquare,
    label: 'WhatsApp',
    color: 'text-channels-whatsapp-text bg-channels-whatsapp-bg border-channels-whatsapp-border',
  },
  EMAIL: {
    icon: Mail,
    label: 'Email',
    color: 'text-channels-email-text bg-channels-email-bg border-channels-email-border',
  },
  INSTAGRAM: {
    icon: Instagram,
    label: 'Instagram',
    color: 'text-channels-instagram-text bg-channels-instagram-bg border-channels-instagram-border',
  },
  SMS: {
    icon: Phone,
    label: 'SMS',
    color: 'text-channels-sms-text bg-channels-sms-bg border-channels-sms-border',
  },
  WEBCHAT: {
    icon: Globe,
    label: 'Web',
    color: 'text-channels-web-text bg-channels-web-bg border-channels-web-border',
  },
} as const;

export interface ChannelBadgeProps {
  channel: keyof typeof channelMap;
  size?: keyof typeof sizes;
  showLabel?: boolean;
  className?: string;
}

export function ChannelBadge({ 
  channel, 
  size = 'md', 
  showLabel = true, 
  className 
}: ChannelBadgeProps) {
  const config = channelMap[channel];
  if (!config) return null;
  
  const Icon = config.icon;
  
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium rounded-full border',
        config.color,
        sizes[size],
        className
      )}
    >
      <Icon size={size === 'sm' ? 10 : 12} />
      {showLabel && config.label}
    </span>
  );
}

export default Badge;

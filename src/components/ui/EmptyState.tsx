'use client';

import { clsx } from 'clsx';
import { AlertCircle, Building2, FileText, Inbox, LucideIcon, Search, Users } from 'lucide-react';

import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  variant?: 'default' | 'centered' | 'inline';
  className?: string;
}

export function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const isInline = variant === 'inline';

  return (
    <div
      className={clsx(
        'flex flex-col items-center text-center',
        variant === 'centered' && 'justify-center min-h-[400px]',
        variant === 'default' && 'py-12 px-6',
        isInline && 'py-8 px-4',
        className,
      )}
    >
      <div
        className={clsx(
          'rounded-full bg-bg-hover flex items-center justify-center mb-4',
          isInline ? 'w-12 h-12' : 'w-16 h-16',
        )}
      >
        <Icon size={isInline ? 24 : 32} className="text-text-tertiary" strokeWidth={1.5} />
      </div>
      <h3 className={clsx('font-semibold text-text-primary', isInline ? 'text-sm' : 'text-lg')}>
        {title}
      </h3>
      {description && (
        <p className={clsx('mt-1 text-text-secondary max-w-sm', isInline ? 'text-xs' : 'text-sm')}>
          {description}
        </p>
      )}
      {action && (
        <Button
          variant="primary"
          size={isInline ? 'sm' : 'md'}
          onClick={action.onClick}
          icon={action.icon}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ============================================
// Empty States Predefinidos
// ============================================

export function EmptyContacts({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="Nenhum contato encontrado"
      description="Adicione seu primeiro contato para começar a gerenciar seus relacionamentos."
      action={
        onAdd
          ? {
              label: 'Adicionar Contato',
              onClick: onAdd,
            }
          : undefined
      }
    />
  );
}

export function EmptyCompanies({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={Building2}
      title="Nenhuma empresa encontrada"
      description="Cadastre empresas para organizar seus contatos e negócios."
      action={
        onAdd
          ? {
              label: 'Adicionar Empresa',
              onClick: onAdd,
            }
          : undefined
      }
    />
  );
}

export function EmptyLeads({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="Nenhum lead encontrado"
      description="Capture leads para alimentar seu pipeline de vendas."
      action={
        onAdd
          ? {
              label: 'Adicionar Lead',
              onClick: onAdd,
            }
          : undefined
      }
    />
  );
}

export function EmptyDeals({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      title="Nenhum negócio nesta etapa"
      description="Mova ou crie negócios para esta coluna."
      variant="inline"
      action={
        onAdd
          ? {
              label: 'Novo Negócio',
              onClick: onAdd,
            }
          : undefined
      }
    />
  );
}

export function EmptyConversations() {
  return (
    <EmptyState
      icon={Inbox}
      title="Nenhuma conversa"
      description="As conversas aparecerão aqui quando você receber mensagens."
    />
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      icon={Search}
      title="Nenhum resultado encontrado"
      description={`Não encontramos resultados para "${query}". Tente buscar por outro termo.`}
    />
  );
}

export function ErrorState({
  title = 'Ocorreu um erro',
  description = 'Não foi possível carregar os dados. Tente novamente.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      action={
        onRetry
          ? {
              label: 'Tentar novamente',
              onClick: onRetry,
            }
          : undefined
      }
    />
  );
}

export default EmptyState;

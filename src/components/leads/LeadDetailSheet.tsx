'use client';

import { ArrowRight, Building2, DollarSign, Edit, Tag, Trash2, TrendingUp } from 'lucide-react';

import { memo } from 'react';

import { Avatar, Badge, Button, Card, Sheet, StatusBadge } from '@/components/ui';

import type { Lead, LeadStatus } from '@/types';

interface LeadDetailSheetProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
  onConvert?: (lead: Lead) => void;
}

export const LeadDetailSheet = memo(function LeadDetailSheet({
  lead,
  open,
  onClose,
  onEdit,
  onDelete,
  onConvert,
}: LeadDetailSheetProps) {
  if (!lead) return null;

  // Lead score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success bg-success-bg';
    if (score >= 50) return 'text-warning bg-warning-bg';
    return 'text-danger bg-danger-bg';
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Detalhes do Lead"
      width="md"
      footer={
        <div className="flex gap-2">
          {onDelete && (
            <Button
              variant="danger-ghost"
              icon={<Trash2 size={16} />}
              onClick={() => onDelete(lead)}
            >
              Excluir
            </Button>
          )}
          <div className="flex-1" />
          {onConvert && lead.status !== 'LOST' && (
            <Button
              variant="success"
              icon={<ArrowRight size={16} />}
              onClick={() => onConvert(lead)}
            >
              Converter em Deal
            </Button>
          )}
          {onEdit && (
            <Button variant="secondary" icon={<Edit size={16} />} onClick={() => onEdit(lead)}>
              Editar
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Avatar name={lead.primaryContact?.name || 'Lead'} size="xl" shape="square" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold text-text-primary">
                {lead.primaryContact?.name || 'Lead sem nome'}
              </h2>
              <StatusBadge status={lead.status as LeadStatus} />
            </div>
            {lead.company && (
              <p className="text-sm text-text-secondary flex items-center gap-1">
                <Building2 size={14} />
                {lead.company.name}
              </p>
            )}
          </div>
        </div>

        {/* Score */}
        <Card variant="outlined" padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">
                Lead Score
              </h3>
              <p className="text-sm text-text-secondary">Pontuação de qualificação do lead</p>
            </div>
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreColor(
                lead.leadScore,
              )}`}
            >
              <span className="text-2xl font-bold">{lead.leadScore}</span>
            </div>
          </div>
        </Card>

        {/* Informações de Qualificação */}
        <Card variant="outlined" padding="sm">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Qualificação
          </h3>
          <div className="space-y-3">
            {/* Origem */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center">
                <Tag size={16} className="text-text-tertiary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-tertiary">Origem</p>
                <Badge variant="default">{lead.sourceType}</Badge>
              </div>
            </div>

            {/* Budget */}
            {lead.budgetRange && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center">
                  <DollarSign size={16} className="text-text-tertiary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-tertiary">Faixa de Orçamento</p>
                  <p className="text-sm text-text-primary">{lead.budgetRange}</p>
                </div>
              </div>
            )}

            {/* Urgência */}
            {lead.urgency && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center">
                  <TrendingUp size={16} className="text-text-tertiary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-tertiary">Urgência</p>
                  <Badge
                    variant={
                      lead.urgency === 'HIGH'
                        ? 'danger'
                        : lead.urgency === 'MEDIUM'
                          ? 'warning'
                          : 'default'
                    }
                  >
                    {lead.urgency === 'HIGH'
                      ? 'Alta'
                      : lead.urgency === 'MEDIUM'
                        ? 'Média'
                        : 'Baixa'}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Owner */}
        {lead.owner && (
          <Card variant="outlined" padding="sm">
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
              Responsável
            </h3>
            <div className="flex items-center gap-3">
              <Avatar name={lead.owner.name} size="md" />
              <div>
                <p className="font-medium text-text-primary">{lead.owner.name}</p>
                <p className="text-sm text-text-tertiary">{lead.owner.email}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Metadados */}
        <Card variant="outlined" padding="sm">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Informações do Sistema
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-tertiary">Criado em</span>
              <span className="text-text-secondary">
                {new Date(lead.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-tertiary">Atualizado em</span>
              <span className="text-text-secondary">
                {new Date(lead.updatedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </Sheet>
  );
});

export default LeadDetailSheet;

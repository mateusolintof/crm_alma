'use client';

import { Building2, Link as LinkIcon, Mail, Phone } from 'lucide-react';

import { memo, useMemo } from 'react';

import { Avatar, Badge, Card } from '@/components/ui';

import type { Conversation } from '@/types';

interface ContactPanelProps {
  conversation: Conversation;
}

export const ContactPanel = memo(function ContactPanel({ conversation }: ContactPanelProps) {
  const contactName = conversation.contact?.name || conversation.company?.name || 'Sem nome';

  // Parse contact info
  const contactInfo = useMemo(() => {
    if (!conversation.contact) return { email: null, phone: null };

    try {
      const emails = JSON.parse(conversation.contact.emails || '[]');
      const phones = JSON.parse(conversation.contact.phones || '[]');
      return {
        email: emails[0] || null,
        phone: phones[0] || null,
      };
    } catch {
      return { email: null, phone: null };
    }
  }, [conversation.contact]);

  return (
    <div className="w-80 bg-white border-l border-bg-border overflow-y-auto flex-shrink-0">
      <div className="p-6">
        {/* Contact Info */}
        <div className="text-center mb-6">
          <Avatar name={contactName} size="2xl" className="mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-text-primary">{contactName}</h3>
          {conversation.company && (
            <p className="text-sm text-text-tertiary flex items-center justify-center gap-1 mt-1">
              <Building2 size={14} />
              {conversation.company.name}
            </p>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
              Detalhes do Contato
            </h4>
            <Card variant="outlined" padding="sm">
              <div className="space-y-3">
                {contactInfo.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center">
                      <Mail size={16} className="text-text-tertiary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-tertiary">Email</p>
                      <p className="text-sm text-text-primary truncate">{contactInfo.email}</p>
                    </div>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center">
                      <Phone size={16} className="text-text-tertiary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-tertiary">Telefone</p>
                      <p className="text-sm text-text-primary truncate">{contactInfo.phone}</p>
                    </div>
                  </div>
                )}
                {!contactInfo.email && !contactInfo.phone && (
                  <p className="text-sm text-text-tertiary text-center py-2">
                    Sem informações de contato
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Linked Deal */}
          {conversation.linkedDeal && (
            <div>
              <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                Oportunidade Vinculada
              </h4>
              <Card variant="outlined" padding="sm" hoverable>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success-bg flex items-center justify-center">
                    <LinkIcon size={16} className="text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary text-sm mb-1">
                      {conversation.linkedDeal.title}
                    </p>
                    {conversation.linkedDeal.expectedMRR && (
                      <p className="text-success font-semibold text-sm">
                        R$ {Number(conversation.linkedDeal.expectedMRR).toLocaleString('pt-BR')}
                        /mês
                      </p>
                    )}
                    <div className="mt-2">
                      <Badge variant="default" size="sm">
                        {conversation.linkedDeal.stage?.name || 'Sem etapa'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
              Ações Rápidas
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="px-3 py-2 text-sm font-medium text-text-secondary bg-bg-hover hover:bg-bg-border rounded-lg transition-colors">
                Ver Perfil
              </button>
              <button className="px-3 py-2 text-sm font-medium text-text-secondary bg-bg-hover hover:bg-bg-border rounded-lg transition-colors">
                Criar Deal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ContactPanel;

'use client';

import { Building2, Edit, Mail, MessageSquare, Phone, Trash2 } from 'lucide-react';

import { memo, useMemo } from 'react';

import { Avatar, Badge, Button, Card, Sheet } from '@/components/ui';

import type { Contact } from '@/types';

interface ContactDetailSheetProps {
  contact: Contact | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
  onMessage?: (contact: Contact) => void;
}

export const ContactDetailSheet = memo(function ContactDetailSheet({
  contact,
  open,
  onClose,
  onEdit,
  onDelete,
  onMessage,
}: ContactDetailSheetProps) {
  // Parse contact info
  const { emails, phones } = useMemo(() => {
    if (!contact) return { emails: [], phones: [] };

    try {
      return {
        emails: JSON.parse(contact.emails || '[]') as string[],
        phones: JSON.parse(contact.phones || '[]') as string[],
      };
    } catch {
      return { emails: [], phones: [] };
    }
  }, [contact]);

  if (!contact) return null;

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Detalhes do Contato"
      width="md"
      footer={
        <div className="flex gap-2">
          {onDelete && (
            <Button
              variant="danger-ghost"
              icon={<Trash2 size={16} />}
              onClick={() => onDelete(contact)}
            >
              Excluir
            </Button>
          )}
          <div className="flex-1" />
          {onMessage && (
            <Button
              variant="secondary"
              icon={<MessageSquare size={16} />}
              onClick={() => onMessage(contact)}
            >
              Mensagem
            </Button>
          )}
          {onEdit && (
            <Button icon={<Edit size={16} />} onClick={() => onEdit(contact)}>
              Editar
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Avatar name={contact.name} size="xl" shape="square" />
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{contact.name}</h2>
            {contact.jobTitle && <p className="text-sm text-text-secondary">{contact.jobTitle}</p>}
            {contact.company && (
              <p className="text-sm text-text-tertiary flex items-center gap-1 mt-1">
                <Building2 size={14} />
                {contact.company.name}
              </p>
            )}
          </div>
        </div>

        {/* Informações de contato */}
        <Card variant="outlined" padding="sm">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Informações de Contato
          </h3>
          <div className="space-y-3">
            {/* Emails */}
            {emails.length > 0 ? (
              emails.map((email, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center">
                    <Mail size={16} className="text-text-tertiary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-tertiary">
                      {index === 0 ? 'Email Principal' : `Email ${index + 1}`}
                    </p>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm text-primary hover:underline truncate block"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 text-text-tertiary">
                <Mail size={16} />
                <span className="text-sm">Nenhum email cadastrado</span>
              </div>
            )}

            {/* Phones */}
            {phones.length > 0 ? (
              phones.map((phone, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center">
                    <Phone size={16} className="text-text-tertiary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-tertiary">
                      {index === 0 ? 'Telefone Principal' : `Telefone ${index + 1}`}
                    </p>
                    <a
                      href={`tel:${phone}`}
                      className="text-sm text-primary hover:underline truncate block"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 text-text-tertiary">
                <Phone size={16} />
                <span className="text-sm">Nenhum telefone cadastrado</span>
              </div>
            )}
          </div>
        </Card>

        {/* Canal Principal */}
        {contact.mainChannel && (
          <Card variant="outlined" padding="sm">
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
              Canal Principal
            </h3>
            <Badge variant="primary">{contact.mainChannel}</Badge>
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
                {new Date(contact.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-tertiary">Atualizado em</span>
              <span className="text-text-secondary">
                {new Date(contact.updatedAt).toLocaleDateString('pt-BR', {
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

export default ContactDetailSheet;

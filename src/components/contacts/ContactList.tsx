'use client';

import { useContacts } from '@/hooks';
import { Building2, Mail, Phone, Plus } from 'lucide-react';

import { useMemo, useState } from 'react';

import ListPage from '@/components/common/ListPage';
import {
  Avatar,
  Button,
  Card,
  EmptyContacts,
  EmptySearch,
  ErrorState,
  SearchInput,
} from '@/components/ui';

const safeParseArray = (value: string | undefined): string[] => {
  try {
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function ContactList() {
  const { data: contacts = [], isLoading, error, refetch } = useContacts();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;

    const query = searchQuery.toLowerCase();
    return contacts.filter((contact) => {
      const name = contact.name?.toLowerCase() || '';
      const company = contact.company?.name?.toLowerCase() || '';
      const emails = safeParseArray(contact.emails).join(' ').toLowerCase();
      const phones = safeParseArray(contact.phones).join(' ');

      return (
        name.includes(query) ||
        company.includes(query) ||
        emails.includes(query) ||
        phones.includes(query)
      );
    });
  }, [contacts, searchQuery]);

  const hasData = contacts.length > 0;
  const hasResults = filteredContacts.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <ListPage
      title="Contatos"
      subtitle="Gerencie seus contatos e relacionamentos"
      count={contacts.length}
      searchSlot={
        <SearchInput
          placeholder="Buscar contatos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          className="w-64 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
        />
      }
      actions={<Button icon={<Plus size={18} />}>Novo Contato</Button>}
      isLoading={isLoading}
      loadingState={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-bg-border animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-bg-border rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-bg-border rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-bg-border rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-bg-border rounded animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      }
      error={!!error}
      errorState={
        <ErrorState
          title="Erro ao carregar contatos"
          description="Não foi possível carregar a lista de contatos."
          onRetry={() => refetch()}
        />
      }
      emptyState={
        <Card>
          <EmptyContacts onAdd={() => {}} />
        </Card>
      }
      emptySearchState={
        <Card>
          <EmptySearch query={searchQuery} />
        </Card>
      }
      hasData={hasData}
      hasResults={hasResults}
      isSearching={isSearching}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} hoverable className="group">
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={contact.name} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                  {contact.name}
                </h3>
                <p className="text-sm text-text-tertiary">{contact.role || 'Sem cargo'}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-text-tertiary" />
                <span className="truncate">
                  {safeParseArray(contact.emails)[0] || 'Sem e-mail'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-text-tertiary" />
                <span className="truncate">
                  {safeParseArray(contact.phones)[0] || 'Sem telefone'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-text-tertiary" />
                <span className="truncate">{contact.company?.name || 'Sem empresa'}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ListPage>
  );
}

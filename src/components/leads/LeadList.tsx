'use client';

import { useCreateLead, useLeads } from '@/hooks';
import { Building2, Calendar, Plus, Tag, User } from 'lucide-react';

import { useCallback, useMemo, useState } from 'react';

import ListPage from '@/components/common/ListPage';
import {
  Badge,
  Button,
  Card,
  EmptyLeads,
  EmptySearch,
  ErrorState,
  FormField,
  Input,
  Modal,
  SearchInput,
  Select,
  StatusBadge,
} from '@/components/ui';

import type { CreateLeadData } from '@/hooks/useLeads';

import type { LeadStatus } from '@/types';

const initialFormData: CreateLeadData = {
  name: '',
  email: '',
  phone: '',
  companyName: '',
  sourceType: 'MANUAL',
};

export default function LeadList() {
  const { data: leads = [], isLoading, error, refetch } = useLeads();
  const createLead = useCreateLead();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CreateLeadData>(initialFormData);

  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const query = searchQuery.toLowerCase();
    return leads.filter((lead) => {
      const contactName = lead.primaryContact?.name?.toLowerCase() || '';
      const companyName = lead.company?.name?.toLowerCase() || '';
      const sourceType = lead.sourceType?.toLowerCase() || '';
      return (
        contactName.includes(query) || companyName.includes(query) || sourceType.includes(query)
      );
    });
  }, [leads, searchQuery]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await createLead.mutateAsync(formData);
        setShowModal(false);
        setFormData(initialFormData);
      } catch {
        // Erro já tratado pelo hook
      }
    },
    [formData, createLead],
  );

  const handleInputChange = useCallback((field: keyof CreateLeadData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const hasData = leads.length > 0;
  const hasResults = filteredLeads.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <ListPage
      title="Leads"
      subtitle="Gerencie seus leads e oportunidades"
      count={leads.length}
      searchSlot={
        <SearchInput
          placeholder="Buscar leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          className="w-64 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
        />
      }
      actions={
        <Button icon={<Plus size={18} />} onClick={() => setShowModal(true)}>
          Novo Lead
        </Button>
      }
      isLoading={isLoading}
      loadingState={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-bg-border animate-pulse" />
                <div className="h-6 w-20 bg-bg-border rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-bg-border rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-bg-border rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-bg-border rounded animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      }
      error={!!error}
      errorState={
        <ErrorState
          title="Erro ao carregar leads"
          description="Não foi possível carregar a lista de leads."
          onRetry={() => refetch()}
        />
      }
      emptyState={
        <>
          <Card>
            <EmptyLeads onAdd={() => setShowModal(true)} />
          </Card>
          <LeadFormModal
            open={showModal}
            onClose={() => setShowModal(false)}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isSubmitting={createLead.isPending}
          />
        </>
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
        {filteredLeads.map((lead) => (
          <Card key={lead.id} hoverable className="group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <User size={20} />
                </div>
              </div>
              <StatusBadge status={lead.status as LeadStatus} />
            </div>

            <div className="space-y-2 text-sm">
              <div className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                {lead.primaryContact?.name || 'Desconhecido'}
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Building2 size={16} className="text-text-tertiary flex-shrink-0" />
                <span className="truncate">{lead.company?.name || 'Sem empresa'}</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Tag size={16} className="text-text-tertiary flex-shrink-0" />
                <Badge variant="default" size="sm">
                  {lead.sourceType}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-text-tertiary text-xs mt-3 pt-3 border-t border-bg-border">
                <Calendar size={14} />
                {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <LeadFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isSubmitting={createLead.isPending}
      />
    </ListPage>
  );
}

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  formData: CreateLeadData;
  onInputChange: (field: keyof CreateLeadData, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

function LeadFormModal({
  open,
  onClose,
  formData,
  onInputChange,
  onSubmit,
  isSubmitting,
}: LeadFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo Lead"
      description="Cadastre um novo lead para o funil"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} loading={isSubmitting}>
            Salvar Lead
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField label="Nome do Lead" required>
          <Input
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            required
            className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
          />
        </FormField>
        <FormField label="E-mail">
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
          />
        </FormField>
        <FormField label="Telefone">
          <Input
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
          />
        </FormField>
        <FormField label="Empresa">
          <Input
            value={formData.companyName}
            onChange={(e) => onInputChange('companyName', e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
          />
        </FormField>
        <FormField label="Origem">
          <Select
            value={formData.sourceType}
            onValueChange={(value) => onInputChange('sourceType', value)}
            options={[
              { label: 'Manual', value: 'MANUAL' },
              { label: 'Indicação', value: 'REFERRAL' },
              { label: 'Site', value: 'WEBSITE' },
              { label: 'Eventos', value: 'EVENT' },
            ]}
          />
        </FormField>
      </form>
    </Modal>
  );
}

'use client';

import { useState, useMemo, useCallback } from 'react';
import { User, Building2, Tag, Calendar, Plus, X } from 'lucide-react';
import { useLeads, useCreateLead } from '@/hooks';
import {
    Button,
    Card,
    SearchInput,
    EmptyLeads,
    EmptySearch,
    ErrorState,
    StatusBadge,
    Badge,
    Modal,
    Input,
    Select,
    FormField,
} from '@/components/ui';
import type { LeadStatus } from '@/types';

// Formulário de criação de lead
interface LeadFormData {
    name: string;
    email: string;
    phone: string;
    companyName: string;
    sourceType: string;
}

const initialFormData: LeadFormData = {
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
    const [formData, setFormData] = useState<LeadFormData>(initialFormData);

    // Filtrar leads com memoização
    const filteredLeads = useMemo(() => {
        if (!searchQuery.trim()) return leads;

        const query = searchQuery.toLowerCase();
        return leads.filter((lead) => {
            const contactName = lead.primaryContact?.name?.toLowerCase() || '';
            const companyName = lead.company?.name?.toLowerCase() || '';
            const sourceType = lead.sourceType?.toLowerCase() || '';

            return (
                contactName.includes(query) ||
                companyName.includes(query) ||
                sourceType.includes(query)
            );
        });
    }, [leads, searchQuery]);

    // Handlers
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await createLead.mutateAsync(formData);
            setShowModal(false);
            setFormData(initialFormData);
        } catch (error) {
            // Erro já tratado pelo hook
        }
    }, [formData, createLead]);

    const handleInputChange = useCallback((field: keyof LeadFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="space-y-1">
                        <div className="h-8 w-24 bg-bg-border rounded animate-pulse" />
                        <div className="h-4 w-40 bg-bg-border rounded animate-pulse" />
                    </div>
                    <div className="h-9 w-32 bg-bg-border rounded animate-pulse" />
                </div>
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
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <ErrorState
                    title="Erro ao carregar leads"
                    description="Não foi possível carregar a lista de leads."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    // Empty state
    if (!leads.length) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-text-primary">Leads</h1>
                        <p className="text-sm text-text-secondary mt-1">
                            Gerencie seus leads e oportunidades
                        </p>
                    </div>
                    <Button icon={<Plus size={18} />} onClick={() => setShowModal(true)}>
                        Novo Lead
                    </Button>
                </div>
                <Card>
                    <EmptyLeads onAdd={() => setShowModal(true)} />
                </Card>
                
                {/* Modal de criação */}
                <LeadFormModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    isSubmitting={createLead.isPending}
                />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary">Leads</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <SearchInput
                        placeholder="Buscar leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        className="w-64"
                    />
                    <Button icon={<Plus size={18} />} onClick={() => setShowModal(true)}>
                        Novo Lead
                    </Button>
                </div>
            </div>

            {/* Empty search result */}
            {searchQuery && filteredLeads.length === 0 ? (
                <Card>
                    <EmptySearch query={searchQuery} />
                </Card>
            ) : (
                /* Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredLeads.map((lead) => (
                        <Card
                            key={lead.id}
                            hoverable
                            className="group"
                        >
                            {/* Header with Status */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <User size={20} />
                                    </div>
                                </div>
                                <StatusBadge status={lead.status as LeadStatus} />
                            </div>

                            {/* Lead Info */}
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
                                    <Badge variant="default" size="sm">{lead.sourceType}</Badge>
                                </div>
                                <div className="flex items-center gap-2 text-text-tertiary text-xs mt-3 pt-3 border-t border-bg-border">
                                    <Calendar size={14} />
                                    {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal de criação */}
            <LeadFormModal
                open={showModal}
                onClose={() => setShowModal(false)}
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                isSubmitting={createLead.isPending}
            />
        </div>
    );
}

// Componente do Modal separado
interface LeadFormModalProps {
    open: boolean;
    onClose: () => void;
    formData: LeadFormData;
    onInputChange: (field: keyof LeadFormData, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
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
            description="Adicione um novo lead ao seu pipeline de vendas"
            size="md"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="lead-form"
                        loading={isSubmitting}
                    >
                        Salvar Lead
                    </Button>
                </>
            }
        >
            <form id="lead-form" onSubmit={onSubmit} className="space-y-4">
                <FormField label="Nome do Contato" required>
                    <Input
                        placeholder="Ex: João Silva"
                        value={formData.name}
                        onChange={(e) => onInputChange('name', e.target.value)}
                        required
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Email">
                        <Input
                            type="email"
                            placeholder="joao@empresa.com"
                            value={formData.email}
                            onChange={(e) => onInputChange('email', e.target.value)}
                        />
                    </FormField>

                    <FormField label="Telefone">
                        <Input
                            placeholder="+55 11 99999-9999"
                            value={formData.phone}
                            onChange={(e) => onInputChange('phone', e.target.value)}
                        />
                    </FormField>
                </div>

                <FormField label="Empresa">
                    <Input
                        placeholder="Nome da Empresa"
                        value={formData.companyName}
                        onChange={(e) => onInputChange('companyName', e.target.value)}
                    />
                </FormField>

                <FormField label="Origem">
                    <Select
                        value={formData.sourceType}
                        onChange={(e) => onInputChange('sourceType', e.target.value)}
                    >
                        <option value="MANUAL">Manual</option>
                        <option value="WHATSAPP">WhatsApp</option>
                        <option value="SITE_FORM">Site</option>
                        <option value="REFERRAL">Indicação</option>
                        <option value="COLD_CALL">Cold Call</option>
                    </Select>
                </FormField>
            </form>
        </Modal>
    );
}

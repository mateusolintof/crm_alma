'use client';

import { useState, useMemo } from 'react';
import { Mail, Phone, Building2, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { useContacts } from '@/hooks';
import {
    Button,
    Avatar,
    Card,
    SearchInput,
    SkeletonList,
    EmptyContacts,
    EmptySearch,
    ErrorState,
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

    // Filtrar contatos com memoização
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

    // Loading state
    if (isLoading) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="space-y-1">
                        <div className="h-8 w-32 bg-bg-border rounded animate-pulse" />
                        <div className="h-4 w-48 bg-bg-border rounded animate-pulse" />
                    </div>
                    <div className="h-9 w-36 bg-bg-border rounded animate-pulse" />
                </div>
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
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <ErrorState
                    title="Erro ao carregar contatos"
                    description="Não foi possível carregar a lista de contatos."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    // Empty state
    if (!contacts.length) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-text-primary">Contatos</h1>
                        <p className="text-sm text-text-secondary mt-1">
                            Gerencie seus contatos e relacionamentos
                        </p>
                    </div>
                    <Button icon={<Plus size={18} />}>
                        Novo Contato
                    </Button>
                </div>
                <Card>
                    <EmptyContacts onAdd={() => {}} />
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary">Contatos</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        {contacts.length} {contacts.length === 1 ? 'contato' : 'contatos'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <SearchInput
                        placeholder="Buscar contatos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        className="w-64"
                    />
                    <Button icon={<Plus size={18} />}>
                        Novo Contato
                    </Button>
                </div>
            </div>

            {/* Empty search result */}
            {searchQuery && filteredContacts.length === 0 ? (
                <Card>
                    <EmptySearch query={searchQuery} />
                </Card>
            ) : (
                /* Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredContacts.map((contact) => {
                        const emails = safeParseArray(contact.emails);
                        const phones = safeParseArray(contact.phones);

                        return (
                            <Card
                                key={contact.id}
                                hoverable
                                className="group"
                            >
                                {/* Avatar + Name */}
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar
                                        name={contact.name}
                                        size="lg"
                                        shape="square"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                                            {contact.name}
                                        </h3>
                                        <p className="text-sm text-text-tertiary truncate flex items-center gap-1">
                                            <Building2 size={14} />
                                            {contact.company?.name || 'Sem empresa'}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <Mail size={16} className="text-text-tertiary flex-shrink-0" />
                                        <span className="truncate">{emails[0] || 'Sem email'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <Phone size={16} className="text-text-tertiary flex-shrink-0" />
                                        <span className="truncate">{phones[0] || 'Sem telefone'}</span>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

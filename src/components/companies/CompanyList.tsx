'use client';

import { useState, useMemo } from 'react';
import { Building2, Globe, Tag, Plus, Users } from 'lucide-react';
import { useCompanies } from '@/hooks';
import {
    Button,
    Avatar,
    Card,
    SearchInput,
    EmptyCompanies,
    EmptySearch,
    ErrorState,
    Badge,
} from '@/components/ui';

export default function CompanyList() {
    const { data: companies = [], isLoading, error, refetch } = useCompanies();
    const [searchQuery, setSearchQuery] = useState('');

    // Filtrar empresas com memoização
    const filteredCompanies = useMemo(() => {
        if (!searchQuery.trim()) return companies;

        const query = searchQuery.toLowerCase();
        return companies.filter((company) => {
            const name = company.name?.toLowerCase() || '';
            const segment = company.segment?.toLowerCase() || '';
            const website = company.website?.toLowerCase() || '';

            return (
                name.includes(query) ||
                segment.includes(query) ||
                website.includes(query)
            );
        });
    }, [companies, searchQuery]);

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
                    title="Erro ao carregar empresas"
                    description="Não foi possível carregar a lista de empresas."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    // Empty state
    if (!companies.length) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-text-primary">Empresas</h1>
                        <p className="text-sm text-text-secondary mt-1">
                            Gerencie as empresas dos seus clientes
                        </p>
                    </div>
                    <Button icon={<Plus size={18} />}>
                        Nova Empresa
                    </Button>
                </div>
                <Card>
                    <EmptyCompanies onAdd={() => {}} />
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary">Empresas</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        {companies.length} {companies.length === 1 ? 'empresa' : 'empresas'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <SearchInput
                        placeholder="Buscar empresas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        className="w-64"
                    />
                    <Button icon={<Plus size={18} />}>
                        Nova Empresa
                    </Button>
                </div>
            </div>

            {/* Empty search result */}
            {searchQuery && filteredCompanies.length === 0 ? (
                <Card>
                    <EmptySearch query={searchQuery} />
                </Card>
            ) : (
                /* Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCompanies.map((company) => (
                        <Card
                            key={company.id}
                            hoverable
                            className="group"
                        >
                            {/* Company Icon + Name */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <Building2 size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                                        {company.name}
                                    </h3>
                                    {company._count?.contacts !== undefined && (
                                        <p className="text-xs text-text-tertiary flex items-center gap-1">
                                            <Users size={12} />
                                            {company._count.contacts} contatos
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Tag size={16} className="text-text-tertiary flex-shrink-0" />
                                    {company.segment ? (
                                        <Badge variant="default" size="sm">
                                            {company.segment}
                                        </Badge>
                                    ) : (
                                        <span className="text-text-tertiary">Sem segmento</span>
                                    )}
                                </div>
                                {company.website && (
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <Globe size={16} className="text-text-tertiary flex-shrink-0" />
                                        <a
                                            href={company.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-primary hover:underline truncate"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {company.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

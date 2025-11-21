'use client';

import { useEffect, useState } from 'react';
import { Building2, Globe, Tag, Plus } from 'lucide-react';

type Company = {
    id: string;
    name: string;
    segment?: string;
    website?: string;
};

export default function CompanyList() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCompanies() {
            try {
                const res = await fetch('/api/companies');
                const data = await res.json();
                setCompanies(data);
            } catch (error) {
                console.error('Failed to fetch companies', error);
                setError('Erro ao carregar empresas.');
            } finally {
                setLoading(false);
            }
        }
        fetchCompanies();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-6">
                <div className="text-text-secondary">Carregando empresas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full p-6">
                <div className="text-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-text-primary">Empresas</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition-all duration-150 hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                    <Plus size={18} />
                    Nova Empresa
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companies.map(company => (
                    <div
                        key={company.id}
                        className="bg-white border border-bg-border rounded-lg p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                    >
                        {/* Company Icon + Name */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-lg border border-primary/20">
                                <Building2 size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                                    {company.name}
                                </h3>
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-text-secondary">
                                <Tag size={16} className="text-text-tertiary flex-shrink-0" />
                                <span className="truncate">{company.segment || 'Sem segmento'}</span>
                            </div>
                            {company.website && (
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Globe size={16} className="text-text-tertiary flex-shrink-0" />
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-primary hover:underline truncate"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        {company.website.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { User, Building2, Tag, Calendar, Plus, X } from 'lucide-react';

type Lead = {
    id: string;
    status: string;
    sourceType: string;
    createdAt: string;
    primaryContact?: { name: string };
    company?: { name: string };
};

export default function LeadList() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        sourceType: 'MANUAL',
    });

    useEffect(() => {
        fetchLeads();
    }, []);

    async function fetchLeads() {
        try {
            const res = await fetch('/api/leads');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setLeads(data);
        } catch (error) {
            console.error('Failed to fetch leads', error);
            setError('Erro ao carregar leads.');
        } finally {
            setLoading(false);
        }
    }

    const getCsrfToken = () => {
        if (typeof document === 'undefined') return null;
        const match = document.cookie.split('; ').find(row => row.startsWith('csrf-token='));
        return match ? decodeURIComponent(match.split('=')[1]) : null;
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitError(null);
        const csrf = getCsrfToken();
        if (!csrf) {
            setSubmitError('Token de segurança ausente. Refaça o login.');
            return;
        }
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf },
                body: JSON.stringify(formData),
            });
            setShowForm(false);
            setFormData({ name: '', email: '', phone: '', companyName: '', sourceType: 'MANUAL' });
            fetchLeads();
        } catch (error) {
            console.error('Failed to create lead', error);
            setSubmitError('Erro ao salvar lead.');
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-6">
                <div className="text-text-secondary">Carregando leads...</div>
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

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            NEW: 'bg-info-bg text-info border-info/20',
            CONTACTED: 'bg-warning-bg text-warning border-warning/20',
            QUALIFIED: 'bg-success-bg text-success border-success/20',
            LOST: 'bg-danger-bg text-danger border-danger/20',
        };
        return colors[status] || 'bg-bg-surface-hover text-text-tertiary border-bg-border';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-text-primary">Leads</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition-all duration-150 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Cancelar' : 'Novo Lead'}
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="bg-white border border-bg-border rounded-lg p-6 mb-6 shadow-md animate-slide-up">
                    {submitError && (
                        <div className="mb-4 p-3 bg-danger-bg border border-danger/20 text-danger rounded-md text-sm">
                            {submitError}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Nome do Contato</label>
                            <input
                                className="w-full px-3 py-2 border border-bg-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Ex: João Silva"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                            <input
                                className="w-full px-3 py-2 border border-bg-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="joao@empresa.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Telefone</label>
                            <input
                                className="w-full px-3 py-2 border border-bg-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="+55 11 99999-9999"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Empresa</label>
                            <input
                                className="w-full px-3 py-2 border border-bg-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Nome da Empresa"
                                value={formData.companyName}
                                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Origem</label>
                            <select
                                className="w-full px-3 py-2 border border-bg-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                value={formData.sourceType}
                                onChange={e => setFormData({ ...formData, sourceType: e.target.value })}
                            >
                                <option value="MANUAL">Manual</option>
                                <option value="WHATSAPP">WhatsApp</option>
                                <option value="SITE_FORM">Site</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition-all duration-150 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                            >
                                Salvar Lead
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leads.map(lead => (
                    <div
                        key={lead.id}
                        className="bg-white border border-bg-border rounded-lg p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                    >
                        {/* Header with Status */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <User size={20} />
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                                {lead.status}
                            </span>
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
                                <span className="px-2 py-0.5 bg-bg-surface-hover rounded text-xs">{lead.sourceType}</span>
                            </div>
                            <div className="flex items-center gap-2 text-text-tertiary text-xs mt-3">
                                <Calendar size={14} />
                                {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import styles from '../contacts/Contacts.module.css'; // Reusing styles

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

    // Form state
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

    if (loading) return <div style={{ padding: '24px' }}>Carregando leads...</div>;
    if (error) {
        return <div style={{ padding: '24px', color: '#fca5a5' }}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Leads</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{ padding: '10px 16px', background: 'var(--primary-color)', color: '#0b1220', border: 'none', borderRadius: '10px', fontWeight: 700, boxShadow: '0 10px 20px rgba(20, 184, 166, 0.25)', cursor: 'pointer' }}
                >
                    + Novo Lead
                </button>
            </div>

            {showForm && (
                <div style={{ background: '#ffffff', padding: '16px', borderRadius: 'var(--radius-lg)', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
                    {submitError && (
                        <div style={{ marginBottom: '12px', color: '#c00' }}>{submitError}</div>
                    )}
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px', maxWidth: '400px' }}>
                        <input
                            placeholder="Nome do Contato"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                            style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#f8fafc', color: 'var(--text-strong)' }}
                        />
                        <input
                            placeholder="Email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-2)', color: 'var(--text-strong)' }}
                        />
                        <input
                            placeholder="Telefone"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-2)', color: 'var(--text-strong)' }}
                        />
                        <input
                            placeholder="Empresa (Opcional)"
                            value={formData.companyName}
                            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                            style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-2)', color: 'var(--text-strong)' }}
                        />
                        <select
                            value={formData.sourceType}
                            onChange={e => setFormData({ ...formData, sourceType: e.target.value })}
                            style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-2)', color: 'var(--text-strong)' }}
                        >
                            <option value="MANUAL">Manual</option>
                            <option value="WHATSAPP">WhatsApp</option>
                            <option value="SITE_FORM">Site</option>
                        </select>
                        <button type="submit" style={{ padding: '10px', background: 'var(--primary-color)', color: '#0b1220', border: 'none', borderRadius: '10px', fontWeight: 700, boxShadow: '0 10px 20px rgba(20, 184, 166, 0.25)', cursor: 'pointer' }}>
                            Salvar Lead
                        </button>
                    </form>
                </div>
            )}

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Contato</th>
                            <th className={styles.th}>Empresa</th>
                            <th className={styles.th}>Origem</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead.id} className={styles.tr}>
                                <td className={styles.td}>{lead.primaryContact?.name || 'Desconhecido'}</td>
                                <td className={styles.td}>{lead.company?.name || '-'}</td>
                                <td className={styles.td}><span className={styles.tag}>{lead.sourceType}</span></td>
                                <td className={styles.td}>{lead.status}</td>
                                <td className={styles.td}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

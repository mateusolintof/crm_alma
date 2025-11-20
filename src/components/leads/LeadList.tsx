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
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            setShowForm(false);
            setFormData({ name: '', email: '', phone: '', companyName: '', sourceType: 'MANUAL' });
            fetchLeads();
        } catch (error) {
            console.error('Failed to create lead', error);
        }
    }

    if (loading) return <div>Carregando leads...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Leads</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{ padding: '8px 16px', background: 'var(--primary-color)', color: 'var(--text-on-dark)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    + Novo Lead
                </button>
            </div>

            {showForm && (
                <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px', maxWidth: '400px' }}>
                        <input
                            placeholder="Nome do Contato"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <input
                            placeholder="Email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <input
                            placeholder="Telefone"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <input
                            placeholder="Empresa (Opcional)"
                            value={formData.companyName}
                            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <select
                            value={formData.sourceType}
                            onChange={e => setFormData({ ...formData, sourceType: e.target.value })}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                            <option value="MANUAL">Manual</option>
                            <option value="WHATSAPP">WhatsApp</option>
                            <option value="SITE_FORM">Site</option>
                        </select>
                        <button type="submit" style={{ padding: '8px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Salvar Lead
                        </button>
                    </form>
                </div>
            )}

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
    );
}

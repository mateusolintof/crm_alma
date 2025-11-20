'use client';

import { useEffect, useState } from 'react';
import styles from '../contacts/Contacts.module.css'; // Reusing styles

type Company = {
    id: string;
    name: string;
    segment?: string;
    website?: string;
};

export default function CompanyList() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCompanies() {
            try {
                const res = await fetch('/api/companies');
                const data = await res.json();
                setCompanies(data);
            } catch (error) {
                console.error('Failed to fetch companies', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCompanies();
    }, []);

    if (loading) return <div>Carregando empresas...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Empresas</h1>
                <button style={{ padding: '8px 16px', background: 'var(--primary-color)', color: 'var(--text-on-dark)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    + Nova Empresa
                </button>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Nome</th>
                        <th className={styles.th}>Segmento</th>
                        <th className={styles.th}>Website</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map(company => (
                        <tr key={company.id} className={styles.tr}>
                            <td className={styles.td}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className={styles.avatar} style={{ borderRadius: '4px' }}>{company.name.charAt(0)}</div>
                                    {company.name}
                                </div>
                            </td>
                            <td className={styles.td}>{company.segment || '-'}</td>
                            <td className={styles.td}>
                                {company.website ? <a href={company.website} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{company.website}</a> : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

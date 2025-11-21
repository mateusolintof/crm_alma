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

    if (loading) return <div style={{ padding: '24px' }}>Carregando empresas...</div>;
    if (error) {
        return <div style={{ padding: '24px', color: '#fca5a5' }}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Empresas</h1>
                <button className="btn btn-primary">
                    + Nova Empresa
                </button>
            </div>

            <div className={styles.tableWrap}>
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
                                        <div className={styles.avatar} style={{ borderRadius: '10px' }}>{company.name.charAt(0).toUpperCase()}</div>
                                        {company.name}
                                    </div>
                                </td>
                                <td className={styles.td}>{company.segment || '-'}</td>
                                <td className={styles.td}>
                                    {company.website ? <a href={company.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>{company.website}</a> : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

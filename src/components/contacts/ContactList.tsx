'use client';

import { useEffect, useState } from 'react';
import styles from './Contacts.module.css';

type Contact = {
    id: string;
    name: string;
    company?: { name: string };
    emails: string; // JSON string
    phones: string; // JSON string
};

export default function ContactList() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContacts() {
            try {
                const res = await fetch('/api/contacts');
                const data = await res.json();
                setContacts(data);
            } catch (error) {
                console.error('Failed to fetch contacts', error);
            } finally {
                setLoading(false);
            }
        }
        fetchContacts();
    }, []);

    if (loading) return <div style={{ padding: '24px' }}>Carregando contatos...</div>;

    if (!contacts.length) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Contatos</h1>
                    <button style={{ padding: '10px 16px', background: 'var(--primary-color)', color: '#0b172a', border: 'none', borderRadius: '10px', fontWeight: 700, boxShadow: '0 10px 20px rgba(15, 157, 146, 0.2)', cursor: 'pointer' }}>
                        + Novo Contato
                    </button>
                </div>
                <div style={{ padding: '24px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Nenhum contato ainda. Adicione o primeiro.
                </div>
            </div>
        );
    }

    const safeParseArray = (value: string | undefined) => {
        try {
            const parsed = value ? JSON.parse(value) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Contatos</h1>
                <button style={{ padding: '10px 16px', background: 'var(--primary-color)', color: '#0b1220', border: 'none', borderRadius: '10px', fontWeight: 700, boxShadow: '0 10px 20px rgba(20, 184, 166, 0.25)', cursor: 'pointer' }}>
                    + Novo Contato
                </button>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Nome</th>
                            <th className={styles.th}>Empresa</th>
                            <th className={styles.th}>Email</th>
                            <th className={styles.th}>Telefone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(contact => {
                            const emails = safeParseArray(contact.emails);
                            const phones = safeParseArray(contact.phones);
                            return (
                                <tr key={contact.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div className={styles.avatar}>{contact.name.charAt(0).toUpperCase()}</div>
                                            {contact.name}
                                        </div>
                                    </td>
                                    <td className={styles.td}>{contact.company?.name || '-'}</td>
                                    <td className={styles.td}>{emails[0] || '-'}</td>
                                    <td className={styles.td}>{phones[0] || '-'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

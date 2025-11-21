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

    if (loading) return <div>Carregando contatos...</div>;

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
                <button style={{ padding: '8px 16px', background: 'var(--primary-color)', color: 'var(--text-on-dark)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    + Novo Contato
                </button>
            </div>

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
                                        <div className={styles.avatar}>{contact.name.charAt(0)}</div>
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
    );
}

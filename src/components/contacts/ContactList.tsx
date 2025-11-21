'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, Building2, Plus } from 'lucide-react';

type Contact = {
    id: string;
    name: string;
    company?: { name: string };
    emails: string;
    phones: string;
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

    const safeParseArray = (value: string | undefined) => {
        try {
            const parsed = value ? JSON.parse(value) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-6">
                <div className="text-text-secondary">Carregando contatos...</div>
            </div>
        );
    }

    if (!contacts.length) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-text-primary">Contatos</h1>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition-all duration-150 hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                        <Plus size={18} />
                        Novo Contato
                    </button>
                </div>
                <div className="bg-white border border-bg-border rounded-lg p-12 text-center animate-fade-in">
                    <div className="text-text-tertiary">Nenhum contato ainda. Adicione o primeiro.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-text-primary">Contatos</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition-all duration-150 hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                    <Plus size={18} />
                    Novo Contato
                </button>
            </div>

            {/* Cards Grid - Modern Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map(contact => {
                    const emails = safeParseArray(contact.emails);
                    const phones = safeParseArray(contact.phones);

                    return (
                        <div
                            key={contact.id}
                            className="bg-white border border-bg-border rounded-lg p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                        >
                            {/* Avatar + Name */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-lg border border-primary/20">
                                    {contact.name.charAt(0).toUpperCase()}
                                </div>
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

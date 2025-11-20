'use client';

import { useState } from 'react';
import styles from './Inbox.module.css';
import { Search, Filter, Phone, Video, MoreVertical, Send, Paperclip } from 'lucide-react';
import clsx from 'clsx';

// Mock Data Types
type Conversation = {
    id: string;
    contactName: string;
    lastMessage: string;
    time: string;
    unread: number;
    channel: 'whatsapp' | 'email' | 'instagram';
    avatarColor?: string;
};

type Message = {
    id: string;
    text: string;
    direction: 'inbound' | 'outbound';
    timestamp: string;
};

// Mock Data
const MOCK_CONVERSATIONS: Conversation[] = [
    { id: '1', contactName: 'João Silva', lastMessage: 'Gostaria de saber mais sobre o plano...', time: '10:30', unread: 2, channel: 'whatsapp' },
    { id: '2', contactName: 'Maria Souza', lastMessage: 'Obrigado pelo retorno!', time: 'Yesterday', unread: 0, channel: 'instagram' },
    { id: '3', contactName: 'Empresa X', lastMessage: 'Segue o comprovante em anexo.', time: 'Mon', unread: 0, channel: 'email' },
];

const MOCK_MESSAGES: Message[] = [
    { id: '1', text: 'Olá, tudo bem?', direction: 'outbound', timestamp: '10:00' },
    { id: '2', text: 'Oi! Gostaria de saber mais sobre o plano de tráfego pago.', direction: 'inbound', timestamp: '10:05' },
    { id: '3', text: 'Claro! Temos opções a partir de R$ 2k/mês. Qual seu orçamento?', direction: 'outbound', timestamp: '10:10' },
];

export default function InboxLayout() {
    const [selectedId, setSelectedId] = useState<string | null>('1');
    const [messageText, setMessageText] = useState('');

    const selectedConversation = MOCK_CONVERSATIONS.find(c => c.id === selectedId);

    return (
        <div className={styles.container}>
            {/* Left Panel: List */}
            <div className={styles.panel}>
                <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Inbox</h2>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: '#999' }} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '6px', border: '1px solid #ddd' }}
                        />
                    </div>
                </div>

                <div>
                    {MOCK_CONVERSATIONS.map(conv => (
                        <div
                            key={conv.id}
                            className={clsx(styles.conversationItem, selectedId === conv.id && styles.active)}
                            onClick={() => setSelectedId(conv.id)}
                        >
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div className={styles.avatar}>{conv.contactName.charAt(0)}</div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 600 }}>{conv.contactName}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>{conv.time}</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {conv.lastMessage}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Center Panel: Thread */}
            <div className={styles.panel}>
                {selectedConversation ? (
                    <>
                        <div className={styles.threadHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className={styles.avatar}>{selectedConversation.contactName.charAt(0)}</div>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{selectedConversation.contactName}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Online agora</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', color: '#666' }}>
                                <Phone size={20} />
                                <Video size={20} />
                                <MoreVertical size={20} />
                            </div>
                        </div>

                        <div className={styles.messageList}>
                            {MOCK_MESSAGES.map(msg => (
                                <div key={msg.id} className={clsx(styles.messageBubble, msg.direction === 'inbound' ? styles.messageInbound : styles.messageOutbound)}>
                                    {msg.text}
                                    <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>
                                        {msg.timestamp}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.composer}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <Paperclip size={20} color="#888" />
                                <input
                                    className={styles.input}
                                    placeholder="Digite sua mensagem..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                />
                                <button style={{ background: 'var(--primary-color)', color: 'var(--text-on-dark)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                        Selecione uma conversa
                    </div>
                )}
            </div>

            {/* Right Panel: Context */}
            <div className={styles.panel}>
                {selectedConversation ? (
                    <>
                        <div className={styles.contextSection} style={{ textAlign: 'center' }}>
                            <div className={styles.avatar} style={{ width: '80px', height: '80px', margin: '0 auto 16px', fontSize: '2rem' }}>
                                {selectedConversation.contactName.charAt(0)}
                            </div>
                            <h3 style={{ fontSize: '1.2rem' }}>{selectedConversation.contactName}</h3>
                            <p style={{ color: '#666' }}>CEO @ Empresa X</p>
                        </div>

                        <div className={styles.contextSection}>
                            <div className={styles.sectionTitle}>Detalhes</div>
                            <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem' }}>
                                <div><strong>Email:</strong> joao@exemplo.com</div>
                                <div><strong>Telefone:</strong> +55 11 99999-9999</div>
                                <div><strong>Origem:</strong> WhatsApp</div>
                            </div>
                        </div>

                        <div className={styles.contextSection}>
                            <div className={styles.sectionTitle}>Oportunidade</div>
                            <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '8px' }}>
                                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Contrato Tráfego Pago</div>
                                <div style={{ color: 'green', fontWeight: 'bold' }}>R$ 2.500,00 / mês</div>
                                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>Estágio: Negociação (90%)</div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}

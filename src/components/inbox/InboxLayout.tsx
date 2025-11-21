'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Search, Phone, Video, MoreVertical, Send, Paperclip,
    X, Loader2, Link as LinkIcon, Filter, MessageSquare,
    Mail, Instagram, CheckCheck, Check
} from 'lucide-react';
import Image from 'next/image';

// Types based on Prisma schema
type Conversation = {
    id: string;
    contactId: string | null;
    contact: {
        id: string;
        name: string;
        emails: string;
        phones: string;
    } | null;
    companyId: string | null;
    company: {
        id: string;
        name: string;
    } | null;
    channelType: string;
    status: string;
    unreadCount: number;
    lastMessageAt: string;
    linkedDealId: string | null;
    linkedDeal: {
        id: string;
        title: string;
        expectedMRR: number | null;
        stage: {
            name: string;
        };
    } | null;
    messages: Message[];
};

type Message = {
    id: string;
    content: string;
    direction: string;
    timestamp: string;
    mediaUrl: string | null;
    mediaType: string | null;
    sender: {
        name: string;
    } | null;
    contact: {
        name: string;
    } | null;
};

const CHANNEL_ICONS = {
    WHATSAPP: MessageSquare,
    EMAIL: Mail,
    INSTAGRAM: Instagram,
};

const CHANNEL_COLORS = {
    WHATSAPP: 'text-green-500',
    EMAIL: 'text-blue-500',
    INSTAGRAM: 'text-pink-500',
};

export default function InboxLayout() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterChannel, setFilterChannel] = useState<string | null>(null);
    const [showLinkDeal, setShowLinkDeal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const selectedConversation = conversations.find(c => c.id === selectedId);

    // Fetch conversations
    useEffect(() => {
        fetchConversations();
        // Poll for new messages every 5 seconds
        const interval = setInterval(fetchConversations, 5000);
        return () => clearInterval(interval);
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation?.messages]);

    async function fetchConversations() {
        try {
            const res = await fetch('/api/conversations');
            if (!res.ok) throw new Error('Failed to fetch conversations');
            const data = await res.json();
            setConversations(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar conversas');
            setLoading(false);
        }
    }

    async function sendMessage() {
        if (!messageText.trim() || !selectedId) return;

        setSending(true);
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: selectedId,
                    content: messageText,
                }),
            });

            if (!res.ok) throw new Error('Failed to send message');

            setMessageText('');
            // Refresh conversation to get new message
            await fetchConversations();
        } catch (err) {
            console.error(err);
            alert('Erro ao enviar mensagem');
        } finally {
            setSending(false);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const getContactName = (conv: Conversation) => {
        return conv.contact?.name || conv.company?.name || 'Sem nome';
    };

    const getContactInfo = (conv: Conversation) => {
        if (conv.contact) {
            const emails = JSON.parse(conv.contact.emails || '[]');
            const phones = JSON.parse(conv.contact.phones || '[]');
            return {
                email: emails[0] || null,
                phone: phones[0] || null,
            };
        }
        return { email: null, phone: null };
    };

    const filteredConversations = conversations.filter(conv => {
        const matchesSearch = getContactName(conv).toLowerCase().includes(searchQuery.toLowerCase());
        const matchesChannel = !filterChannel || conv.channelType === filterChannel;
        return matchesSearch && matchesChannel;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-bg-app overflow-hidden">
            {/* LEFT: Conversation List */}
            <div className="w-80 bg-white border-r border-bg-border flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-bg-border">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-semibold text-text-primary">Inbox</h2>
                        <button
                            onClick={() => setFilterChannel(null)}
                            className="p-2 hover:bg-bg-surface-hover rounded-lg transition-colors"
                        >
                            <Filter size={18} className="text-text-tertiary" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search size={16} className="absolute left-3 top-2.5 text-text-tertiary" />
                        <input
                            type="text"
                            placeholder="Buscar conversas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-bg-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    {/* Channel Filters */}
                    <div className="flex gap-2">
                        {['WHATSAPP', 'EMAIL', 'INSTAGRAM'].map(channel => {
                            const Icon = CHANNEL_ICONS[channel as keyof typeof CHANNEL_ICONS];
                            const isActive = filterChannel === channel;
                            return (
                                <button
                                    key={channel}
                                    onClick={() => setFilterChannel(isActive ? null : channel)}
                                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                        isActive
                                            ? 'bg-primary text-white'
                                            : 'bg-bg-surface-hover text-text-secondary hover:bg-bg-border'
                                    }`}
                                >
                                    <Icon size={14} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                    {error && (
                        <div className="p-4 text-center text-danger text-sm">{error}</div>
                    )}
                    {filteredConversations.length === 0 && !error && (
                        <div className="p-4 text-center text-text-tertiary text-sm">
                            Nenhuma conversa encontrada
                        </div>
                    )}
                    {filteredConversations.map(conv => {
                        const ChannelIcon = CHANNEL_ICONS[conv.channelType as keyof typeof CHANNEL_ICONS] || MessageSquare;
                        const lastMessage = conv.messages[conv.messages.length - 1];
                        const isActive = selectedId === conv.id;

                        return (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedId(conv.id)}
                                className={`p-4 border-b border-bg-border cursor-pointer transition-colors hover:bg-bg-surface-hover ${
                                    isActive ? 'bg-primary-subtle border-l-4 border-l-primary' : ''
                                }`}
                            >
                                <div className="flex gap-3">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                                        {getContactName(conv).charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-text-primary truncate flex items-center gap-2">
                                                {getContactName(conv)}
                                                <ChannelIcon
                                                    size={14}
                                                    className={CHANNEL_COLORS[conv.channelType as keyof typeof CHANNEL_COLORS] || 'text-text-tertiary'}
                                                />
                                            </h3>
                                            <span className="text-xs text-text-tertiary flex-shrink-0">
                                                {new Date(conv.lastMessageAt).toLocaleTimeString('pt-BR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary truncate">
                                            {lastMessage?.content || 'Sem mensagens'}
                                        </p>
                                        {conv.unreadCount > 0 && (
                                            <div className="mt-1">
                                                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
                                                    {conv.unreadCount}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CENTER: Chat View */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 px-6 border-b border-bg-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold">
                                    {getContactName(selectedConversation).charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary">
                                        {getContactName(selectedConversation)}
                                    </h3>
                                    <p className="text-xs text-text-tertiary">
                                        {selectedConversation.channelType}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-text-secondary">
                                <button className="hover:text-primary transition-colors">
                                    <Phone size={20} />
                                </button>
                                <button className="hover:text-primary transition-colors">
                                    <Video size={20} />
                                </button>
                                <button
                                    onClick={() => setShowLinkDeal(!showLinkDeal)}
                                    className="hover:text-primary transition-colors"
                                >
                                    <LinkIcon size={20} />
                                </button>
                                <button className="hover:text-primary transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                            {selectedConversation.messages.map(msg => {
                                const isOutbound = msg.direction === 'OUTBOUND';
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex mb-4 ${isOutbound ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-md px-4 py-2 rounded-lg ${
                                                isOutbound
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white text-text-primary border border-bg-border'
                                            }`}
                                        >
                                            {msg.mediaUrl && (
                                                <div className="mb-2">
                                                    <Image
                                                        src={msg.mediaUrl}
                                                        alt="Media"
                                                        width={300}
                                                        height={200}
                                                        className="rounded"
                                                    />
                                                </div>
                                            )}
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                            <div className="flex items-center gap-1 mt-1 justify-end">
                                                <span className={`text-xs ${isOutbound ? 'text-white/70' : 'text-text-tertiary'}`}>
                                                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                                {isOutbound && (
                                                    <CheckCheck size={14} className="text-white/70" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Composer */}
                        <div className="p-4 border-t border-bg-border bg-white">
                            <div className="flex items-center gap-3">
                                <button className="p-2 hover:bg-bg-surface-hover rounded-lg transition-colors">
                                    <Paperclip size={20} className="text-text-tertiary" />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Digite sua mensagem..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={sending}
                                    className="flex-1 px-4 py-2 border border-bg-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={sending || !messageText.trim()}
                                    className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sending ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Send size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-text-tertiary">
                        <div className="text-center">
                            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Selecione uma conversa para começar</p>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT: Contact Info */}
            {selectedConversation && (
                <div className="w-80 bg-white border-l border-bg-border overflow-y-auto">
                    <div className="p-6">
                        {/* Contact Info */}
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-2xl mx-auto mb-3">
                                {getContactName(selectedConversation).charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary">
                                {getContactName(selectedConversation)}
                            </h3>
                            {selectedConversation.company && (
                                <p className="text-sm text-text-tertiary">
                                    {selectedConversation.company.name}
                                </p>
                            )}
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-semibold text-text-tertiary uppercase mb-2">
                                    Detalhes
                                </h4>
                                <div className="space-y-2 text-sm">
                                    {getContactInfo(selectedConversation).email && (
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-text-tertiary" />
                                            <span>{getContactInfo(selectedConversation).email}</span>
                                        </div>
                                    )}
                                    {getContactInfo(selectedConversation).phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-text-tertiary" />
                                            <span>{getContactInfo(selectedConversation).phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Linked Deal */}
                            {selectedConversation.linkedDeal && (
                                <div>
                                    <h4 className="text-xs font-semibold text-text-tertiary uppercase mb-2">
                                        Oportunidade
                                    </h4>
                                    <div className="bg-bg-surface-hover p-3 rounded-lg">
                                        <p className="font-semibold text-text-primary text-sm mb-1">
                                            {selectedConversation.linkedDeal.title}
                                        </p>
                                        {selectedConversation.linkedDeal.expectedMRR && (
                                            <p className="text-success font-semibold">
                                                R$ {Number(selectedConversation.linkedDeal.expectedMRR).toLocaleString('pt-BR')}/mês
                                            </p>
                                        )}
                                        <p className="text-xs text-text-tertiary mt-1">
                                            Estágio: {selectedConversation.linkedDeal.stage.name}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

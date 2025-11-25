'use client';

import { memo, useMemo } from 'react';
import { Filter, MessageSquare, Mail, Instagram } from 'lucide-react';
import { clsx } from 'clsx';
import { Avatar, SearchInput, Badge, ChannelBadge } from '@/components/ui';
import type { Conversation, ChannelType } from '@/types';

type FilterChannel = 'WHATSAPP' | 'EMAIL' | 'INSTAGRAM';

const CHANNEL_ICONS: Record<FilterChannel, typeof MessageSquare> = {
    WHATSAPP: MessageSquare,
    EMAIL: Mail,
    INSTAGRAM: Instagram,
};

const CHANNEL_COLORS: Record<FilterChannel, string> = {
    WHATSAPP: 'text-green-500',
    EMAIL: 'text-blue-500',
    INSTAGRAM: 'text-pink-500',
};

interface ConversationListProps {
    conversations: Conversation[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filterChannel: ChannelType | null;
    onFilterChange: (channel: ChannelType | null) => void;
}

export const ConversationList = memo(function ConversationList({
    conversations,
    selectedId,
    onSelect,
    searchQuery,
    onSearchChange,
    filterChannel,
    onFilterChange,
}: ConversationListProps) {
    return (
        <div className="w-80 bg-white border-r border-bg-border flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-bg-border">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-text-primary">Inbox</h2>
                    <button
                        onClick={() => onFilterChange(null)}
                        className={clsx(
                            'p-2 rounded-lg transition-colors',
                            filterChannel ? 'bg-primary text-white' : 'hover:bg-bg-hover'
                        )}
                    >
                        <Filter size={18} className={filterChannel ? '' : 'text-text-tertiary'} />
                    </button>
                </div>

                {/* Search */}
                <SearchInput
                    placeholder="Buscar conversas..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onClear={() => onSearchChange('')}
                    className="mb-3"
                />

                {/* Channel Filters */}
                <div className="flex gap-2">
                    {(['WHATSAPP', 'EMAIL', 'INSTAGRAM'] as FilterChannel[]).map((channel) => {
                        const Icon = CHANNEL_ICONS[channel];
                        const isActive = filterChannel === channel;
                        return (
                            <button
                                key={channel}
                                onClick={() => onFilterChange(isActive ? null : channel)}
                                className={clsx(
                                    'flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary text-white'
                                        : 'bg-bg-hover text-text-secondary hover:bg-bg-border'
                                )}
                            >
                                <Icon size={14} />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-text-tertiary text-sm">
                        Nenhuma conversa encontrada
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <ConversationItem
                            key={conv.id}
                            conversation={conv}
                            isActive={selectedId === conv.id}
                            onSelect={() => onSelect(conv.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
});

// Componente do item de conversa memoizado
interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onSelect: () => void;
}

const ConversationItem = memo(function ConversationItem({
    conversation: conv,
    isActive,
    onSelect,
}: ConversationItemProps) {
    const contactName = conv.contact?.name || conv.company?.name || 'Sem nome';
    const channelKey = conv.channelType as FilterChannel;
    const ChannelIcon = CHANNEL_ICONS[channelKey] || MessageSquare;
    const lastMessage = conv.messages[conv.messages.length - 1];

    return (
        <div
            onClick={onSelect}
            className={clsx(
                'p-4 border-b border-bg-border cursor-pointer transition-colors hover:bg-bg-hover',
                isActive && 'bg-primary-subtle border-l-4 border-l-primary'
            )}
        >
            <div className="flex gap-3">
                {/* Avatar */}
                <Avatar name={contactName} size="lg" />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-text-primary truncate flex items-center gap-2">
                            {contactName}
                            <ChannelIcon
                                size={14}
                                className={CHANNEL_COLORS[channelKey] || 'text-text-tertiary'}
                            />
                        </h3>
                        <span className="text-xs text-text-tertiary flex-shrink-0">
                            {new Date(conv.lastMessageAt).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>
                    <p className="text-sm text-text-secondary truncate">
                        {lastMessage?.content || 'Sem mensagens'}
                    </p>
                    {conv.unreadCount > 0 && (
                        <div className="mt-1">
                            <Badge variant="primary" size="sm">
                                {conv.unreadCount}
                            </Badge>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default ConversationList;

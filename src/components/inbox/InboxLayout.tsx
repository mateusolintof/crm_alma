'use client';

import { useConversations, useMarkAsRead, useSendMessage } from '@/hooks';

import { useCallback, useMemo, useState } from 'react';

import { ErrorState, SkeletonInbox } from '@/components/ui';

import type { ChannelType } from '@/types';

import { ChatArea } from './ChatArea';
import { ContactPanel } from './ContactPanel';
import { ConversationList } from './ConversationList';

export default function InboxLayout() {
  const { data: conversations = [], isLoading, error, refetch } = useConversations();
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();

  // Estado local
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState<ChannelType | null>(null);

  // Filtrar conversas com memoização
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      // Filtro por canal
      if (filterChannel && conv.channelType !== filterChannel) {
        return false;
      }

      // Filtro por busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const contactName = conv.contact?.name?.toLowerCase() || '';
        const companyName = conv.company?.name?.toLowerCase() || '';

        if (!contactName.includes(query) && !companyName.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [conversations, filterChannel, searchQuery]);

  // Conversa selecionada
  const selectedConversation = conversations.find((c) => c.id === selectedId) || null;

  // Handlers
  const handleSelectConversation = useCallback(
    (id: string) => {
      setSelectedId(id);
      setMessageText('');
      // Marcar como lida
      markAsReadMutation.mutate(id);
    },
    [markAsReadMutation],
  );

  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() || !selectedId) return;

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedId,
        content: messageText,
      });
      setMessageText('');
    } catch {
      // Erro já tratado pelo hook
    }
  }, [messageText, selectedId, sendMessageMutation]);

  // Loading state
  if (isLoading) {
    return <SkeletonInbox />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-app">
        <ErrorState
          title="Erro ao carregar conversas"
          description="Não foi possível carregar suas conversas. Tente novamente."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-app overflow-hidden">
      {/* Lista de Conversas */}
      <ConversationList
        conversations={filteredConversations}
        selectedId={selectedId}
        onSelect={handleSelectConversation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterChannel={filterChannel}
        onFilterChange={setFilterChannel}
      />

      {/* Área de Chat */}
      <ChatArea
        conversation={selectedConversation}
        messageText={messageText}
        onMessageChange={setMessageText}
        onSendMessage={handleSendMessage}
        isSending={sendMessageMutation.isPending}
      />

      {/* Painel de Contato */}
      {selectedConversation && <ContactPanel conversation={selectedConversation} />}
    </div>
  );
}

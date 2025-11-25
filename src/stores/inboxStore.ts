import { create } from 'zustand';

import type { Conversation, InboxFilters, Message } from '@/types';

interface InboxState {
  // Estado das conversas
  conversations: Conversation[];
  selectedConversationId: string | null;
  isLoading: boolean;
  error: string | null;

  // Filtros
  filters: InboxFilters;
  searchQuery: string;

  // Mensagem sendo composta
  draftMessage: string;
  isSending: boolean;

  // Ações de conversas
  setConversations: (conversations: Conversation[]) => void;
  selectConversation: (id: string | null) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  addMessage: (conversationId: string, message: Message) => void;
  markAsRead: (conversationId: string) => void;

  // Ações de filtro
  setFilters: (filters: Partial<InboxFilters>) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;

  // Ações de composição
  setDraftMessage: (message: string) => void;
  setIsSending: (sending: boolean) => void;

  // Estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed / Getters
  getFilteredConversations: () => Conversation[];
  getSelectedConversation: () => Conversation | undefined;
}

export const useInboxStore = create<InboxState>((set, get) => ({
  // --- Estado inicial ---
  conversations: [],
  selectedConversationId: null,
  isLoading: true,
  error: null,
  filters: {},
  searchQuery: '',
  draftMessage: '',
  isSending: false,

  // --- Ações de conversas ---
  setConversations: (conversations) => set({ conversations, isLoading: false }),

  selectConversation: (id) => {
    set({ selectedConversationId: id, draftMessage: '' });
    // Marcar como lida ao selecionar
    if (id) {
      get().markAsRead(id);
    }
  },

  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...updates } : conv,
      ),
    })),

  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessageAt: message.timestamp,
              unreadCount:
                message.direction === 'INBOUND' ? conv.unreadCount + 1 : conv.unreadCount,
            }
          : conv,
      ),
    })),

  markAsRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
      ),
    })),

  // --- Ações de filtro ---
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  clearFilters: () => set({ filters: {}, searchQuery: '' }),

  // --- Ações de composição ---
  setDraftMessage: (message) => set({ draftMessage: message }),
  setIsSending: (sending) => set({ isSending: sending }),

  // --- Estado ---
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),

  // --- Computed ---
  getFilteredConversations: () => {
    const { conversations, filters, searchQuery } = get();

    return conversations.filter((conv) => {
      // Filtro por canal
      if (filters.channel && conv.channelType !== filters.channel) {
        return false;
      }

      // Filtro por status
      if (filters.status && conv.status !== filters.status) {
        return false;
      }

      // Filtro por busca
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        const contactName = conv.contact?.name?.toLowerCase() || '';
        const companyName = conv.company?.name?.toLowerCase() || '';
        const lastMessage = conv.messages[conv.messages.length - 1]?.content?.toLowerCase() || '';

        if (
          !contactName.includes(search) &&
          !companyName.includes(search) &&
          !lastMessage.includes(search)
        ) {
          return false;
        }
      }

      return true;
    });
  },

  getSelectedConversation: () => {
    const { conversations, selectedConversationId } = get();
    return conversations.find((conv) => conv.id === selectedConversationId);
  },
}));

// Hook helper para ações comuns
export const useInboxActions = () => {
  const store = useInboxStore();

  const sendMessage = async (content: string) => {
    const { selectedConversationId, setIsSending, setDraftMessage, addMessage } = store;

    if (!selectedConversationId || !content.trim()) return false;

    setIsSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          content,
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const message = await res.json();
      addMessage(selectedConversationId, message);
      setDraftMessage('');
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const refreshConversations = async () => {
    store.setLoading(true);
    try {
      const res = await fetch('/api/conversations');
      if (!res.ok) throw new Error('Failed to fetch conversations');
      const data = await res.json();
      store.setConversations(data);
    } catch {
      store.setError('Erro ao carregar conversas');
    }
  };

  return {
    sendMessage,
    refreshConversations,
  };
};

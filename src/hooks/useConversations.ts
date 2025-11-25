import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Conversation, Message } from '@/types';
import { useToast } from '@/stores';

// Keys para cache
export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...conversationKeys.lists(), filters] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
};

// Fetch de conversas
async function fetchConversations(): Promise<Conversation[]> {
  const res = await fetch('/api/conversations');
  if (!res.ok) throw new Error('Falha ao carregar conversas');
  return res.json();
}

// Enviar mensagem
interface SendMessageData {
  conversationId: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
}

async function sendMessage(data: SendMessageData): Promise<Message> {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao enviar mensagem');
  return res.json();
}

// Hook: Lista de conversas com polling
export function useConversations(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: conversationKeys.lists(),
    queryFn: fetchConversations,
    // Polling padrão de 5 segundos (apenas quando a aba está ativa)
    refetchInterval: options?.refetchInterval ?? 5000,
    refetchIntervalInBackground: false,
  });
}

// Hook: Enviar mensagem
export function useSendMessage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: sendMessage,
    // Atualização otimista
    onMutate: async (newMessage) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: conversationKeys.lists() });
      
      // Snapshot do estado anterior
      const previousConversations = queryClient.getQueryData<Conversation[]>(
        conversationKeys.lists()
      );

      // Atualizar otimisticamente
      if (previousConversations) {
        const optimisticMessage: Message = {
          id: `temp-${Date.now()}`,
          tenantId: '',
          conversationId: newMessage.conversationId,
          channelType: 'WHATSAPP',
          direction: 'OUTBOUND',
          content: newMessage.content,
          timestamp: new Date().toISOString(),
          mediaUrl: newMessage.mediaUrl || undefined,
          mediaType: newMessage.mediaType || undefined,
        };

        queryClient.setQueryData<Conversation[]>(
          conversationKeys.lists(),
          previousConversations.map((conv) =>
            conv.id === newMessage.conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, optimisticMessage],
                  lastMessageAt: optimisticMessage.timestamp,
                }
              : conv
          )
        );
      }

      return { previousConversations };
    },
    onError: (err, variables, context) => {
      // Rollback em caso de erro
      if (context?.previousConversations) {
        queryClient.setQueryData(
          conversationKeys.lists(),
          context.previousConversations
        );
      }
      toast.error('Erro ao enviar', 'A mensagem não foi enviada. Tente novamente.');
    },
    onSettled: () => {
      // Revalidar dados após mutação
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}

// Hook: Marcar conversa como lida
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      // Por enquanto, apenas atualização local
      // TODO: Implementar endpoint no backend
      return conversationId;
    },
    onMutate: async (conversationId) => {
      await queryClient.cancelQueries({ queryKey: conversationKeys.lists() });
      
      const previousConversations = queryClient.getQueryData<Conversation[]>(
        conversationKeys.lists()
      );

      if (previousConversations) {
        queryClient.setQueryData<Conversation[]>(
          conversationKeys.lists(),
          previousConversations.map((conv) =>
            conv.id === conversationId
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      }

      return { previousConversations };
    },
    onError: (err, variables, context) => {
      if (context?.previousConversations) {
        queryClient.setQueryData(
          conversationKeys.lists(),
          context.previousConversations
        );
      }
    },
  });
}


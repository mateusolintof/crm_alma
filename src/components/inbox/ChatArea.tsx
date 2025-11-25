'use client';

import { clsx } from 'clsx';
import {
  CheckCheck,
  Link as LinkIcon,
  Loader2,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Video,
} from 'lucide-react';

import { memo, useCallback, useEffect, useRef } from 'react';

import Image from 'next/image';

import { Avatar, Button } from '@/components/ui';

import type { Conversation, Message } from '@/types';

interface ChatAreaProps {
  conversation: Conversation | null;
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
  isSending: boolean;
}

export const ChatArea = memo(function ChatArea({
  conversation,
  messageText,
  onMessageChange,
  onSendMessage,
  isSending,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCount = conversation?.messages?.length ?? 0;

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.id, messageCount]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSendMessage();
      }
    },
    [onSendMessage],
  );

  const getContactName = (conv: Conversation) => {
    return conv.contact?.name || conv.company?.name || 'Sem nome';
  };

  // Empty state
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-bg-hover flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={32} className="text-text-tertiary" strokeWidth={1.5} />
          </div>
          <h3 className="font-semibold text-text-primary mb-1">Selecione uma conversa</h3>
          <p className="text-sm text-text-tertiary max-w-xs">
            Escolha uma conversa na lista à esquerda para começar a conversar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="h-16 px-6 border-b border-bg-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Avatar name={getContactName(conversation)} size="md" />
          <div>
            <h3 className="font-semibold text-text-primary">{getContactName(conversation)}</h3>
            <p className="text-xs text-text-tertiary">{conversation.channelType}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Video size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <LinkIcon size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical size={20} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        {conversation.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <div className="p-4 border-t border-bg-border bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Paperclip size={20} />
          </Button>
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={messageText}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            className={clsx(
              'flex-1 px-4 py-2 border border-bg-border rounded-lg',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'disabled:opacity-50',
            )}
          />
          <Button onClick={onSendMessage} disabled={isSending || !messageText.trim()} size="icon">
            {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </Button>
        </div>
      </div>
    </div>
  );
});

// Componente de bolha de mensagem memoizado
interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = memo(function MessageBubble({ message: msg }: MessageBubbleProps) {
  const isOutbound = msg.direction === 'OUTBOUND';

  return (
    <div className={clsx('flex mb-4', isOutbound ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-md px-4 py-2 rounded-2xl',
          isOutbound
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-white text-text-primary border border-bg-border rounded-bl-sm',
        )}
      >
        {msg.mediaUrl && (
          <div className="mb-2">
            <Image src={msg.mediaUrl} alt="Media" width={300} height={200} className="rounded-lg" />
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
        <div className="flex items-center gap-1 mt-1 justify-end">
          <span className={clsx('text-2xs', isOutbound ? 'text-white/70' : 'text-text-tertiary')}>
            {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isOutbound && <CheckCheck size={14} className="text-white/70" />}
        </div>
      </div>
    </div>
  );
});

export default ChatArea;

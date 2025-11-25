import { NextRequest, NextResponse } from 'next/server';

import { withTenant } from '@/lib/api-handlers';
import prisma from '@/lib/prisma';

type MediaType = 'image' | 'video' | 'document' | 'audio';

interface SendMessagePayload {
  conversationId: string;
  content: string;
  mediaUrl?: string;
  mediaType?: MediaType;
}

// Send message (to be forwarded to Evolution API or other channel)
export async function POST(request: NextRequest) {
  try {
    const body: SendMessagePayload = await request.json();
    const { conversationId, content, mediaUrl, mediaType } = body;

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: 'conversationId and content are required' },
        { status: 400 },
      );
    }

    return withTenant(request, async (tenant) => {
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, tenantId: tenant.id },
        include: { contact: true },
      });

      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      const user = await prisma.user.findFirst({
        where: { tenantId: tenant.id },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const message = await prisma.message.create({
        data: {
          tenantId: tenant.id,
          conversationId,
          channelType: conversation.channelType,
          direction: 'OUTBOUND',
          senderId: user.id,
          contactId: conversation.contactId,
          content,
          mediaUrl,
          mediaType,
          timestamp: new Date(),
        },
      });

      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageAt: new Date(),
          unreadCount: 0,
        },
      });

      if (conversation.channelType === 'WHATSAPP' && conversation.contact) {
        try {
          const { sendWhatsAppTextMessage, sendWhatsAppMediaMessage, formatPhoneNumber } =
            await import('@/lib/evolution-api');
          const phones = JSON.parse(conversation.contact.phones || '[]') as string[];
          const phoneNumber = phones[0] ? formatPhoneNumber(phones[0]) : null;

          if (phoneNumber) {
            if (mediaUrl) {
              await sendWhatsAppMediaMessage({
                number: phoneNumber,
                mediaUrl,
                caption: content,
                mediaType,
              });
            } else {
              await sendWhatsAppTextMessage({
                number: phoneNumber,
                text: content,
              });
            }
          }
        } catch (error) {
          console.error('Failed to send WhatsApp message:', error);
        }
      }

      return NextResponse.json(message, { status: 201 });
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

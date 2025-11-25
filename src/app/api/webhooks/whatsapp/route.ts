import { WEBHOOK_API_KEY_HEADER } from '@/constants';

import { NextRequest, NextResponse } from 'next/server';

import { withTenant } from '@/lib/api-handlers';
import prisma from '@/lib/prisma';

/**
 * Webhook receiver for Evolution API (or any third-party WhatsApp integration)
 *
 * Evolution API webhook format example:
 * {
 *   "event": "messages.upsert",
 *   "instance": "instance_name",
 *   "data": {
 *     "key": {
 *       "remoteJid": "5511999999999@s.whatsapp.net",
 *       "fromMe": false,
 *       "id": "message_id"
 *     },
 *     "pushName": "João Silva",
 *     "message": {
 *       "conversation": "Olá, gostaria de saber mais sobre seus serviços"
 *     },
 *     "messageTimestamp": 1234567890,
 *     "messageType": "conversation"
 *   }
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Validate webhook (optional: check API key or signature)
    const apiKey = request.headers.get(WEBHOOK_API_KEY_HEADER);
    if (apiKey !== process.env.WEBHOOK_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse Evolution API webhook
    const { event, data } = payload;

    // Only process incoming messages
    if (event !== 'messages.upsert' || data.key.fromMe) {
      return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }

    // Extract phone number (remove @s.whatsapp.net suffix)
    const phoneNumber = data.key.remoteJid.replace('@s.whatsapp.net', '');
    const senderName = data.pushName || 'Desconhecido';
    const messageContent =
      data.message.conversation || data.message.extendedTextMessage?.text || '';
    const messageTimestamp = new Date(data.messageTimestamp * 1000);

    return withTenant(request, async (tenant) => {
      let contact = await prisma.contact.findFirst({
        where: {
          tenantId: tenant.id,
          phones: {
            contains: phoneNumber,
          },
        },
      });

      if (!contact) {
        contact = await prisma.contact.create({
          data: {
            tenantId: tenant.id,
            name: senderName,
            phones: JSON.stringify([phoneNumber]),
            emails: JSON.stringify([]),
            socialProfiles: JSON.stringify([]),
            mainChannel: 'WHATSAPP',
          },
        });
      }

      let conversation = await prisma.conversation.findFirst({
        where: {
          tenantId: tenant.id,
          contactId: contact.id,
          channelType: 'WHATSAPP',
        },
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            tenantId: tenant.id,
            contactId: contact.id,
            channelType: 'WHATSAPP',
            status: 'OPEN',
            unreadCount: 0,
            lastMessageAt: messageTimestamp,
          },
        });
      }

      await prisma.message.create({
        data: {
          tenantId: tenant.id,
          conversationId: conversation.id,
          contactId: contact.id,
          channelType: 'WHATSAPP',
          direction: 'INBOUND',
          content: messageContent,
          timestamp: messageTimestamp,
        },
      });

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: messageTimestamp,
          unreadCount: {
            increment: 1,
          },
          status: 'OPEN',
        },
      });

      return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

// Optional: GET endpoint to validate webhook is working
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'WhatsApp webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}

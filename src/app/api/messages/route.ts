import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Send message (to be forwarded to Evolution API or other channel)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { conversationId, content, mediaUrl, mediaType } = body;

        if (!conversationId || !content) {
            return NextResponse.json(
                { error: 'conversationId and content are required' },
                { status: 400 }
            );
        }

        // Get conversation details
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                contact: true,
            }
        });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        // Get tenant and user (in production, get from session/auth)
        const tenant = await prisma.tenant.findFirst({
            where: { domain: 'alma.agency' }
        });

        const user = await prisma.user.findFirst({
            where: { tenantId: tenant!.id }
        });

        if (!tenant || !user) {
            return NextResponse.json({ error: 'Tenant or user not found' }, { status: 404 });
        }

        // Create message in database
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
            }
        });

        // Update conversation lastMessageAt
        await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                lastMessageAt: new Date(),
                unreadCount: 0, // Reset unread for outbound
            }
        });

        // Forward message to appropriate channel
        if (conversation.channelType === 'WHATSAPP' && conversation.contact) {
            try {
                const { sendWhatsAppTextMessage, sendWhatsAppMediaMessage, formatPhoneNumber } = await import('@/lib/evolution-api');
                const phones = JSON.parse(conversation.contact.phones || '[]');
                const phoneNumber = formatPhoneNumber(phones[0]);

                if (mediaUrl) {
                    await sendWhatsAppMediaMessage({
                        number: phoneNumber,
                        mediaUrl,
                        caption: content,
                        mediaType: mediaType as any,
                    });
                } else {
                    await sendWhatsAppTextMessage({
                        number: phoneNumber,
                        text: content,
                    });
                }
            } catch (error) {
                console.error('Failed to send WhatsApp message:', error);
                // Don't fail the request - message is saved in DB
            }
        }

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}

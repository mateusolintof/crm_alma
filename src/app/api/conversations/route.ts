import { NextRequest, NextResponse } from 'next/server';

import { withTenant } from '@/lib/api-handlers';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    return withTenant(request, async (tenant) => {
      const conversations = await prisma.conversation.findMany({
        where: {
          tenantId: tenant.id,
        },
        include: {
          contact: {
            select: {
              id: true,
              name: true,
              emails: true,
              phones: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          linkedDeal: {
            select: {
              id: true,
              title: true,
              expectedMRR: true,
              stage: {
                select: {
                  name: true,
                },
              },
            },
          },
          messages: {
            orderBy: {
              timestamp: 'asc',
            },
            include: {
              sender: {
                select: {
                  name: true,
                },
              },
              contact: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          lastMessageAt: 'desc',
        },
      });

      return NextResponse.json(conversations);
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

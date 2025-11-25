import { NextRequest, NextResponse } from 'next/server';

import { withTenant } from '@/lib/api-handlers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  return withTenant(request, async (tenant) => {
    const contacts = await prisma.contact.findMany({
      where: { tenantId: tenant.id },
      include: {
        company: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(contacts);
  });
}

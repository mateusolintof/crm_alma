import { NextRequest, NextResponse } from 'next/server';

import { withTenant } from '@/lib/api-handlers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  return withTenant(request, async (tenant) => {
    const companies = await prisma.company.findMany({
      where: { tenantId: tenant.id },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(companies);
  });
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantByDomain } from '@/services/tenant.service';

export async function GET() {
    const tenant = await getTenantByDomain('alma.agency');
    if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

    const contracts = await prisma.contract.findMany({
        where: { tenantId: tenant.id },
        include: {
            clientAccount: {
                include: { company: true }
            }
        },
        orderBy: { startDate: 'desc' },
    });

    return NextResponse.json(contracts);
}

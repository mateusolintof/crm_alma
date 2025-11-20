import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantByDomain } from '@/services/tenant.service';

export async function GET(request: Request) {
    const tenant = await getTenantByDomain('alma.agency');
    if (!tenant) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const companies = await prisma.company.findMany({
        where: { tenantId: tenant.id },
        orderBy: { name: 'asc' },
    });

    return NextResponse.json(companies);
}

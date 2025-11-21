import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantByDomain } from '@/services/tenant.service';

export async function GET() {
    const tenant = await getTenantByDomain('alma.agency');
    if (!tenant) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const contacts = await prisma.contact.findMany({
        where: { tenantId: tenant.id },
        include: {
            company: true,
        },
        orderBy: { name: 'asc' },
    });

    return NextResponse.json(contacts);
}

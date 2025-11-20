import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantByDomain } from '@/services/tenant.service';

export async function GET(request: Request) {
    // Mock tenant resolution (in real app, from session/subdomain)
    const tenant = await getTenantByDomain('alma.agency');
    if (!tenant) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Get the New Business pipeline
    const pipeline = await prisma.pipeline.findFirst({
        where: {
            tenantId: tenant.id,
            type: 'NEW_BUSINESS',
        },
        include: {
            stages: {
                orderBy: { orderIndex: 'asc' },
                include: {
                    deals: {
                        include: {
                            company: true,
                        },
                    },
                },
            },
        },
    });

    if (!pipeline) {
        return NextResponse.json({ error: 'Pipeline not found' }, { status: 404 });
    }

    return NextResponse.json(pipeline);
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantByDomain } from '@/services/tenant.service';

export async function GET(request: Request) {
    const tenant = await getTenantByDomain('alma.agency');
    if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

    // 1. MRR Data (Mocked for now as we don't have historical records yet)
    // In a real app, we would query MRRRecord table
    const mrrData = [
        { month: 'Jan', mrr: 10000 },
        { month: 'Fev', mrr: 12000 },
        { month: 'Mar', mrr: 15000 },
        { month: 'Abr', mrr: 18000 },
        { month: 'Mai', mrr: 22000 },
        { month: 'Jun', mrr: 25000 },
    ];

    // 2. Funnel Data (Real from Pipeline)
    const pipeline = await prisma.pipeline.findFirst({
        where: { tenantId: tenant.id, type: 'NEW_BUSINESS' },
        include: { stages: { include: { deals: true } } },
    });

    const funnelData = pipeline?.stages.map(stage => ({
        name: stage.name,
        value: stage.deals.length,
    })) || [];

    return NextResponse.json({ mrrData, funnelData });
}

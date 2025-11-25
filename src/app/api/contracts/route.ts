import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/api-handlers';

export async function GET(request: NextRequest) {
    return withTenant(request, async (tenant) => {
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
    });
}

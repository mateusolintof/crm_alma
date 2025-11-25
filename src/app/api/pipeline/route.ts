import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenant } from '@/lib/api-handlers';

export async function GET(request: NextRequest) {
    return withTenant(request, async (tenant) => {
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
    });
}

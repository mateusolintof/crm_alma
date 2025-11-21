import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { assertCsrf } from '@/lib/csrf';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    const body = await request.json();
    const { stageId } = body;

    if (!stageId) {
        return NextResponse.json({ error: 'Stage ID is required' }, { status: 400 });
    }

    try {
        try {
            assertCsrf(request);
        } catch {
            return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
        }

        const updatedDeal = await prisma.deal.update({
            where: { id },
            data: { stageId },
        });

        return NextResponse.json(updatedDeal);
    } catch (error) {
        console.error('Failed to update deal', error);
        return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
    }
}

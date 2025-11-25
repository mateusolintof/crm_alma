import { NextRequest, NextResponse } from 'next/server';

import { withTenant } from '@/lib/api-handlers';
import { assertCsrf } from '@/lib/csrf';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();
  const { stageId } = body;

  if (!stageId) {
    return NextResponse.json({ error: 'Stage ID is required' }, { status: 400 });
  }

  try {
    try {
      await assertCsrf(request);
    } catch {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    return withTenant(request, async (tenant) => {
      const stage = await prisma.pipelineStage.findFirst({
        where: { id: stageId, pipeline: { tenantId: tenant.id } },
      });

      if (!stage) {
        return NextResponse.json({ error: 'Stage not found for tenant' }, { status: 404 });
      }

      const updatedDeal = await prisma.deal.update({
        where: { id, tenantId: tenant.id },
        data: { stageId },
      });

      return NextResponse.json(updatedDeal);
    });
  } catch (error) {
    console.error('Failed to update deal', error);
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}

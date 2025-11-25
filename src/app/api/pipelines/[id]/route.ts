import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET single pipeline
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const pipeline = await prisma.pipeline.findUnique({
      where: { id },
      include: {
        stages: {
          orderBy: { orderIndex: 'asc' },
          include: {
            deals: {
              include: {
                company: true,
                primaryContact: true,
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
  } catch (error) {
    console.error('Error fetching pipeline:', error);
    return NextResponse.json({ error: 'Failed to fetch pipeline' }, { status: 500 });
  }
}

// PATCH update pipeline
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, stages } = body;

    // Update pipeline basic info
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (type) updateData.type = type;

    const pipeline = await prisma.pipeline.update({
      where: { id },
      data: updateData,
      include: {
        stages: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    // Update stages if provided
    if (stages && Array.isArray(stages)) {
      // Delete removed stages
      const stageIds = stages.filter((s: { id?: string }) => s.id).map((s: { id: string }) => s.id);
      await prisma.stage.deleteMany({
        where: {
          pipelineId: id,
          id: { notIn: stageIds },
        },
      });

      // Update or create stages
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i] as { id?: string; name: string; defaultProbability?: number };
        if (stage.id) {
          // Update existing
          await prisma.stage.update({
            where: { id: stage.id },
            data: {
              name: stage.name,
              orderIndex: i,
              defaultProbability: stage.defaultProbability,
            },
          });
        } else {
          // Create new
          await prisma.stage.create({
            data: {
              pipelineId: id,
              name: stage.name,
              orderIndex: i,
              defaultProbability: stage.defaultProbability,
            },
          });
        }
      }
    }

    return NextResponse.json(pipeline);
  } catch (error) {
    console.error('Error updating pipeline:', error);
    return NextResponse.json({ error: 'Failed to update pipeline' }, { status: 500 });
  }
}

// DELETE pipeline
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if pipeline has deals
    const dealsCount = await prisma.deal.count({
      where: { pipelineId: id },
    });

    if (dealsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete pipeline with existing deals' },
        { status: 400 },
      );
    }

    // Delete stages first (cascade)
    await prisma.stage.deleteMany({
      where: { pipelineId: id },
    });

    // Delete pipeline
    await prisma.pipeline.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Pipeline deleted successfully' });
  } catch (error) {
    console.error('Error deleting pipeline:', error);
    return NextResponse.json({ error: 'Failed to delete pipeline' }, { status: 500 });
  }
}

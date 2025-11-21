import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all pipelines
export async function GET() {
    try {
        const tenant = await prisma.tenant.findFirst({
            where: { domain: 'alma.agency' }
        });

        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        const pipelines = await prisma.pipeline.findMany({
            where: { tenantId: tenant.id },
            include: {
                stages: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        _count: {
                            select: { deals: true }
                        }
                    }
                },
                _count: {
                    select: { deals: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(pipelines);
    } catch (error) {
        console.error('Error fetching pipelines:', error);
        return NextResponse.json({ error: 'Failed to fetch pipelines' }, { status: 500 });
    }
}

// POST create new pipeline
export async function POST(request: NextRequest) {
    try {
        const tenant = await prisma.tenant.findFirst({
            where: { domain: 'alma.agency' }
        });

        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        const body = await request.json();
        const { name, type, stages } = body;

        if (!name || !type) {
            return NextResponse.json(
                { error: 'name and type are required' },
                { status: 400 }
            );
        }

        // Create pipeline with stages
        const pipeline = await prisma.pipeline.create({
            data: {
                tenantId: tenant.id,
                name,
                type,
                stages: {
                    create: stages?.map((stage: { name: string; defaultProbability?: number }, index: number) => ({
                        name: stage.name,
                        orderIndex: index,
                        defaultProbability: stage.defaultProbability || null,
                    })) || []
                }
            },
            include: {
                stages: {
                    orderBy: { orderIndex: 'asc' }
                }
            }
        });

        return NextResponse.json(pipeline, { status: 201 });
    } catch (error) {
        console.error('Error creating pipeline:', error);
        return NextResponse.json({ error: 'Failed to create pipeline' }, { status: 500 });
    }
}

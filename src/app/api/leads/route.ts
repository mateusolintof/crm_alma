import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantByDomain } from '@/services/tenant.service';

export async function GET() {
    const tenant = await getTenantByDomain('alma.agency');
    if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

    const leads = await prisma.lead.findMany({
        where: { tenantId: tenant.id },
        include: {
            company: true,
            primaryContact: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(leads);
}

export async function POST(request: Request) {
    const tenant = await getTenantByDomain('alma.agency');
    if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

    const body = await request.json();
    const { name, email, phone, companyName, sourceType } = body;

    try {
        // 1. Create or find Company (simple dedupe by name)
        let company;
        if (companyName) {
            company = await prisma.company.findFirst({
                where: { tenantId: tenant.id, name: companyName },
            });

            if (!company) {
                company = await prisma.company.create({
                    data: {
                        tenantId: tenant.id,
                        name: companyName,
                        tags: '[]',
                    },
                });
            }
        }

        // 2. Create or find Contact (dedupe by email if provided)
        const contactFilters = [
            { name },
            email ? { emails: { contains: email } } : null,
        ].filter(Boolean) as { [key: string]: unknown }[];

        let contact = await prisma.contact.findFirst({
            where: {
                tenantId: tenant.id,
                OR: contactFilters,
            },
        });

        if (!contact) {
            contact = await prisma.contact.create({
                data: {
                    tenantId: tenant.id,
                    companyId: company?.id,
                    name: name,
                    emails: JSON.stringify(email ? [email] : []),
                    phones: JSON.stringify(phone ? [phone] : []),
                    socialProfiles: '[]',
                },
            });
        }

        // 3. Create Lead
        const lead = await prisma.lead.create({
            data: {
                tenantId: tenant.id,
                companyId: company?.id,
                primaryContactId: contact.id,
                sourceType: sourceType || 'MANUAL',
                status: 'OPEN',
                leadScore: 0,
            },
        });

        return NextResponse.json(lead);
    } catch (error) {
        console.error('Failed to create lead', error);
        return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
    }
}

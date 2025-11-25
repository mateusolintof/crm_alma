import { NextRequest, NextResponse } from 'next/server';

import { withTenant } from '@/lib/api-handlers';
import { assertCsrf } from '@/lib/csrf';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    return withTenant(request, async (tenant) => {
      const leads = await prisma.lead.findMany({
        where: { tenantId: tenant.id },
        include: {
          company: true,
          primaryContact: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(leads);
    });
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return withTenant(request, async (tenant) => {
    const body = await request.json();
    const { name, email, phone, companyName, sourceType } = body;

    try {
      try {
        await assertCsrf(request);
      } catch {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
      }

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

      const contactFilters = [{ name }, email ? { emails: { contains: email } } : null].filter(
        Boolean,
      ) as { [key: string]: unknown }[];

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
  });
}

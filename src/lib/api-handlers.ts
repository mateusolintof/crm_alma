import { NextResponse, type NextRequest } from 'next/server';
import type { Tenant } from '@prisma/client';
import { getTenantByDomain } from '@/services/tenant.service';
import { DEFAULT_TENANT_DOMAIN, TENANT_HEADER } from '@/constants';

function normalizeDomain(domain: string | null): string | null {
  if (!domain) return null;
  return domain.split(':')[0]?.toLowerCase() ?? null;
}

export async function resolveTenant(request?: NextRequest): Promise<Tenant | null> {
  const headerDomain = normalizeDomain(request?.headers.get(TENANT_HEADER));
  const urlDomain = request ? normalizeDomain(new URL(request.url).searchParams.get('tenant')) : null;
  const hostDomain = normalizeDomain(request?.headers.get('host'));

  const domain = headerDomain || urlDomain || hostDomain || DEFAULT_TENANT_DOMAIN;
  if (!domain) return null;

  return getTenantByDomain(domain);
}

export async function withTenant(
  request: NextRequest | undefined,
  handler: (tenant: Tenant) => Promise<NextResponse>
): Promise<NextResponse> {
  const tenant = await resolveTenant(request);
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }

  return handler(tenant);
}

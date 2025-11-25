import { prisma } from '@/lib/prisma';

const tenantCache = new Map<string, Awaited<ReturnType<typeof getTenantByDomain>>>();

export async function getTenant(tenantId: string) {
  return await prisma.tenant.findUnique({
    where: { id: tenantId },
  });
}

export async function getTenantByDomain(domain: string) {
  const normalizedDomain = domain.toLowerCase();
  return await prisma.tenant.findFirst({
    where: { domain: normalizedDomain },
  });
}

export async function getCachedTenantByDomain(domain: string) {
  const normalizedDomain = domain.toLowerCase();
  if (tenantCache.has(normalizedDomain)) {
    return tenantCache.get(normalizedDomain) || null;
  }
  const tenant = await getTenantByDomain(normalizedDomain);
  tenantCache.set(normalizedDomain, tenant);
  return tenant;
}

export type TenantWithBranding = Awaited<ReturnType<typeof getTenant>>;

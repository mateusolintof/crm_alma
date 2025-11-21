import { prisma } from '@/lib/prisma'

export async function getTenant(tenantId: string) {
    return await prisma.tenant.findUnique({
        where: { id: tenantId },
    })
}

export async function getTenantByDomain(domain: string) {
    const normalizedDomain = domain.toLowerCase();
    return await prisma.tenant.findFirst({
        where: { domain: normalizedDomain },
    });
}

export type TenantWithBranding = Awaited<ReturnType<typeof getTenant>>

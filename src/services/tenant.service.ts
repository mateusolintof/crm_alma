import { prisma } from '@/lib/prisma'

export async function getTenant(tenantId: string) {
    return await prisma.tenant.findUnique({
        where: { id: tenantId },
    })
}

export async function getTenantByDomain(domain: string) {
    // TODO: Implement domain lookup logic
    // For now, return the first tenant (Alma)
    return await prisma.tenant.findFirst()
}

export type TenantWithBranding = Awaited<ReturnType<typeof getTenant>>

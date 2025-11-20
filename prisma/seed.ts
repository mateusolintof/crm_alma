import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function main() {
    console.log('Seeding database...')

    // 1. Create Tenant: Alma Agência Digital
    const alma = await prisma.tenant.create({
        data: {
            name: 'Alma Agência Digital',
            logoDarkHorizontalUrl: '/mnt/data/WhatsApp Image 2025-10-19 at 11.33.58 (1).jpeg',
            logoDarkVerticalUrl: '/mnt/data/WhatsApp Image 2025-10-19 at 11.33.58.jpeg',
            logoLightHorizontalUrl: '/mnt/data/WhatsApp Image 2025-10-19 at 11.33.59.jpeg',
            logoLightVerticalUrl: '/mnt/data/WhatsApp Image 2025-10-19 at 11.34.01.jpeg',
            primaryColor: '#000000',
            backgroundDark: '#000000',
            backgroundLight: '#FFFFFF',
            accentColor: '#FFFFFF',
            textOnDark: '#FFFFFF',
            textOnLight: '#111111',
        }
    })

    console.log('Created Tenant:', alma.name)

    // 2. Create Users
    const admin = await prisma.user.create({
        data: {
            tenantId: alma.id,
            name: 'Admin Alma',
            email: 'admin@alma.agency',
            role: 'ADMIN'
        }
    })

    const salesRep = await prisma.user.create({
        data: {
            tenantId: alma.id,
            name: 'Vendedor 1',
            email: 'vendas@alma.agency',
            role: 'SALES_REP'
        }
    })

    console.log('Created Users')

    // 3. Create Pipelines
    const newBusinessPipeline = await prisma.pipeline.create({
        data: {
            tenantId: alma.id,
            name: 'Novos Negócios',
            type: 'NEW_BUSINESS',
            stages: {
                create: [
                    { name: 'Lead Novo', orderIndex: 0, defaultProbability: 10 },
                    { name: 'Contato Iniciado', orderIndex: 1, defaultProbability: 20 },
                    { name: 'Qualificação', orderIndex: 2, defaultProbability: 40 },
                    { name: 'Briefing', orderIndex: 3, defaultProbability: 50 },
                    { name: 'Proposta', orderIndex: 4, defaultProbability: 70 },
                    { name: 'Negociação', orderIndex: 5, defaultProbability: 90 },
                    { name: 'Ganho', orderIndex: 6, defaultProbability: 100 },
                    { name: 'Perdido', orderIndex: 7, defaultProbability: 0 },
                ]
            }
        }
    })

    console.log('Created Pipeline:', newBusinessPipeline.name)

    // 4. Create some dummy data
    const company = await prisma.company.create({
        data: {
            tenantId: alma.id,
            name: 'Cliente Exemplo Ltda',
            segment: 'Varejo',
            tags: '["hot", "referral"]'
        }
    })

    await prisma.contact.create({
        data: {
            tenantId: alma.id,
            companyId: company.id,
            name: 'João Silva',
            emails: '["joao@exemplo.com"]',
            phones: '["11999999999"]',
            socialProfiles: '[]'
        }
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

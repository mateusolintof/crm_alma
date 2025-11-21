import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function main() {
    console.log('Seeding database...')

    // 1. Create Tenant: Alma Agência Digital
    const alma = await prisma.tenant.upsert({
        where: { id: 'alma-tenant-id' }, // Use a fixed ID for idempotency if possible, or find unique
        // Since we don't have a unique field other than ID (and domain now), let's use domain for upsert if possible, 
        // but ID is safer if we want to hardcode it. 
        // Actually, let's just create or find first.
        update: {},
        create: {
            name: 'Alma Agência Digital',
            domain: 'alma.agency',
            primaryColor: '#D4AF37', // Gold
            backgroundDark: '#050505',
            backgroundLight: '#F5F5F5',
            accentColor: '#FFFFFF',
            textOnDark: '#FFFFFF',
            textOnLight: '#111111'
        }
    });

    console.log('Created Tenant:', alma.name)

    // 2. Create Users
    await prisma.user.create({
        data: {
            tenantId: alma.id,
            name: 'Admin Alma',
            email: 'admin@alma.agency',
            role: 'ADMIN',
            password: '$2a$10$EpWaTgiFbI.w.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1', // Hash for "123456"
        },
    });

    await prisma.user.upsert({
        where: { email: 'vendas@alma.agency' },
        update: {},
        create: {
            tenantId: alma.id,
            email: 'vendas@alma.agency',
            name: 'João Vendas',
            role: 'SALES_REP',
            password: '$2a$10$EpWaTgiFbI.w.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1', // Hash for "123456"
        },
    });

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

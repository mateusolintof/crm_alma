# CRM Alma

CRM moderno para equipes comerciais e CS, com múltiplos tenants, pipeline Kanban, contatos, inbox e finanças, construído em Next.js 16 + React 19 e banco Supabase Postgres via Prisma.

## Visão Geral
- Multi-tenant: isolamento de dados por organização (Tenant) e branding in-app.
- CRM completo: empresas, contatos, leads, deals, atividades e briefing.
- Pipeline Kanban: visualização por estágios, edição e atualização de deals.
- Inbox unificado: conversas vinculadas a contatos/deals com mensagens e canais.
- Pós-venda/financeiro: contas de cliente, contratos, serviços e MRR.
- Analytics: visão de pipeline e saúde da receita em tempo real (Recharts).
- Autenticação JWT custom: cookies HTTPOnly + CSRF token, roles simples.

## Tecnologias Principais
- Framework: Next.js 16 (App Router) + React 19 + TypeScript.
- Banco de Dados: Supabase Postgres (PG Bouncer) via Prisma ORM.
- Estilos: CSS Modules + CSS variables de branding (dark/light).
- UI & UX: Lucide React (ícones), Recharts (gráficos), dnd-kit (drag & drop).
- Auth/Security: jose (JWT), bcryptjs (hash), CSRF cookie, cookies httpOnly.

## Arquitetura e Componentes
- `src/app/layout.tsx`: carrega tenant padrão, aplica tema (BrandingProvider) e sidebar global.
- `src/app/page.tsx`: redireciona para `/inbox`.
- Páginas principais: `inbox/`, `pipeline/`, `leads/`, `companies/`, `contacts/`, `analytics/`, `login/`.
- Rotas de API (App Router):
  - `api/auth/login`: autenticação; gera cookie `auth-token` e CSRF.
  - `api/leads`, `api/deals/[id]`, `api/pipeline`, `api/companies`, `api/contacts`, `api/contracts`, `api/analytics`: CRUD e consultas para UI.
- `src/components/`: layout (Sidebar), cards, listas, gráficos e providers de tema.
- `src/lib/`: integrações utilitárias (Prisma client, auth helpers, CSRF).
- `src/services/tenant.service.ts`: caching/fetch de Tenant por domínio para branding e isolamento.
- `prisma/schema.prisma`: modelo relacional completo (Tenant, User, Team, Lead/Deal, Pipeline/Stage, Activity, Messaging, Financial).

## Modelo de Dados (resumo)
- Tenant: dados e cores do tenant + relações para todo o CRM.
- Usuário/Time: User (role string), Team e TeamMember.
- CRM Core: Company, Contact, Lead, Deal (com Pipeline/Stage), Activity, Briefing.
- Inbox: Conversation, Message, ChannelAccount.
- Financeiro: ClientAccount, Contract, ServiceSubscription, MRRRecord.
- Auditoria: AuditLog.

## Ambiente e Configuração
1) Pré-requisitos: Node.js 18+; acesso ao projeto Supabase; npm.
2) Dependências:
```bash
npm install
```
3) Variáveis de ambiente: copie `.env.example` para `.env` e preencha com strings do Supabase (Settings > Database > Connection string > Prisma):
```env
DATABASE_URL="postgresql://postgres:<PASSWORD>@db.<PROJECT>.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:<PASSWORD>@db.<PROJECT>.supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-key"
```
- `DATABASE_URL`: conexão via pool (porta 6543) usada pela app.
- `DIRECT_URL`: conexão direta (porta 5432) para migrations/seeds do Prisma.
- (Opcional) `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` se futuramente usar Supabase JS client (storage/auth).

4) Banco de dados (Supabase):
```bash
# Cria as tabelas no banco de dados (obrigatório)
npx prisma db push

# Popula o banco com dados de exemplo/teste (opcional)
# Execute APENAS em desenvolvimento - isso adiciona dados fictícios para testes
# Em produção, pule este passo e adicione seus clientes reais pela interface
npx ts-node prisma/seed.ts
```

**Sobre o seed:**
- **Para ambiente de desenvolvimento/teste**: Execute o seed para ter dados de exemplo prontos (usuários, leads, empresas fictícias)
- **Para ambiente de produção**: NÃO execute o seed. Comece com banco vazio e adicione seus clientes reais através da interface do CRM

5) Desenvolvimento:
```bash
npm run dev
# http://localhost:3000
```

6) Build/produção:
```bash
npm run build
npm run start
```

## Scripts
- `npm run dev`: inicia Next.js em modo desenvolvimento.
- `npm run build`: build de produção.
- `npm run start`: inicia build de produção.
- `npm run lint`: checagem de lint.

## Autenticação e Segurança
- Login via `POST /api/auth/login` com email/senha do tenant.
- Gera cookie `auth-token` (JWT) httpOnly + `csrf-token` não httpOnly.
- Hash de senha com `bcryptjs`; fallback em dev para seeds simples.
- Middleware/guards: use `lib/auth` para validar token e role quando criar novas rotas.

## Branding e Multi-Tenancy
- Tenant define cores/logos (dark/light) e textos base. `BrandingProvider` injeta variáveis CSS globais.
- `getCachedTenantByDomain` resolve tenant pelo domínio; por padrão usa `alma.agency`. Ajuste conforme onboarding multi-domínio.

## Estrutura de Pastas
```
src/
├─ app/           # Rotas Next.js (páginas e APIs)
├─ components/    # UI compartilhada (layout, cards, gráficos, listas)
├─ lib/           # Prisma client, auth helpers, CSRF, utils
├─ services/      # Acesso a dados/tenants
├─ middleware.ts  # Proteção/edge middleware (autenticação)
prisma/
├─ schema.prisma  # Schema Prisma (Supabase Postgres)
└─ seed.ts        # Seed opcional com tenant/dados de teste
```

## Notas Operacionais
- Tenha certeza de que a instância Supabase está com acessos liberados para a origem do app.
- Em produção, mantenha `secure: true` nos cookies (já condicionado por `NODE_ENV`).
- Para novas entidades, crie modelos Prisma e rode `prisma db push` ou `migrate`.
- Caso use Storage/Auth do Supabase, defina as chaves públicas/privadas nas envs opcionais.

## Licença
Este projeto é proprietário e confidencial. A cópia não autorizada, por qualquer meio, é estritamente proibida.

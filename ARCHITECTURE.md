# Alma CRM – Arquitetura e Setup (Frontend-First)

Este documento resume a lógica do projeto, os pontos de configuração essenciais e como rodar o app sem sofrer com problemas de backend. A ideia é deixar o frontend previsível: se o backend estiver OK (DB e variáveis), o app renderiza normalmente; se não, os erros estarão claros.

## Visão Geral
- **Stack UI**: Next.js (App Router) + React 19 + TypeScript + Tailwind CSS v4 (configless).
- **Design Tokens**: definidos em `src/app/globals.css` via `@theme` (cores, spacing, tipografia, animações). Não existe `tailwind.config.ts`.
- **Dados/State**: React Query com hooks especializados em `/src/hooks`. Chaves de cache centralizadas em factories (`createEntityHooks`, `query-keys`).
- **UI Patterns**: ListPage genérica para listas; focus-visible global; animações e cores de canais em tokens.
- **Auth/Tenant**: middleware exige cookie `auth-token`; tenant resolvido via header `x-tenant-domain` ou domínio padrão (`DEFAULT_TENANT_DOMAIN`).

## Fluxo de Dados (Frontend)
1) Hooks (`useContacts`, `useCompanies`, `useLeads`, etc.) chamam rotas API do Next (`/api/*`) com React Query.
2) Cache/key: `src/lib/query-keys.ts` e `createEntityHooks` geram chaves e CRUD hooks.
3) UI consome esses hooks e renderiza estados: loading (skeleton), erro, vazio ou lista.

## Configuração Essencial (para evitar dores de backend)
1) **Variáveis de ambiente** (exemplos):
   - `DEFAULT_TENANT_DOMAIN=alma.agency`
   - `DATABASE_URL=...` (Postgres/Supabase)
   - `JWT_SECRET=...`
   - `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE_NAME` (WhatsApp)
   - `WEBHOOK_API_KEY` (para webhooks de WhatsApp)
2) **Migrations/Seed** (garantir dados para o frontend não ficar só em skeleton):
   ```bash
   npx prisma migrate dev
   npx prisma db seed   # opcional, mas recomendado para popular inbox/leads/empresas
   ```
3) **Credenciais de login** (após seed padrão):
   ```
   Email: admin@alma.agency
   Password: 123456
   ```
4) **CSP em dev**: o `next.config.ts` traz headers de segurança. Se encontrar bloqueio de inline scripts em dev, relaxe temporariamente a CSP para desenvolvimento apenas.
5) **Tenant**: certifique-se de que o domínio configurado existe na tabela `tenant`. Do contrário, APIs retornam 404 e o frontend fica em loading/erro.

## Tailwind v4 (configless)
- Import em `src/app/globals.css`:
  ```css
  @import "tailwindcss";
  @import "../styles/tokens.css";
  ```
- Tokens/anim/keyframes em `@theme` + `@layer utilities` no próprio `globals.css`.
- Sem `tailwind.config.ts`; não é necessário adicionar conteúdo/paths.

## Foco e Acessibilidade
- `:focus-visible` global e utilitário `.focus-ring` para inputs, botões, dropdowns, navegação.
- Componentes principais já recebem classes de foco; ao criar novos, reutilize `.focus-ring`.

## Rodando só o Frontend
1) Instalar deps: `npm install`
2) Rodar em dev: `npm run dev`
3) Para evitar erros de dados: mantenha DB e env válidos + seed. Sem dados, você verá skeleton/estado vazio (não é bug de UI).

## O que NÃO está incluso
- Mock completo de backend: rotas `/api` ainda dependem do banco. Se quiser um modo 100% mock, será preciso adicionar um stub/flag para responder dados estáticos.
- Split físico front/back: ainda é um único app Next. Separar em dois projetos exige nova estrutura de build/deploy.

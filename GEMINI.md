# GEMINI.md - Contexto do Projeto Alma CRM

> **Este arquivo é a fonte da verdade para o Gemini AI trabalhar neste projeto.**
> Leia-o sempre que iniciar uma nova sessão para entender o contexto, stack e convenções.

---

## 1. Visão Geral do Projeto

**Nome**: Alma CRM
**Propósito**: CRM moderno e "boutique" focado em agências e empresas de tecnologia.
**Diferencial**: Combina gestão de vendas (Pipelines Kanban) com um Inbox Unificado estilo WhatsApp Web.
**Arquitetura**: Multi-tenant (SaaS), onde cada cliente tem seus dados isolados.

### Core Features

- **Inbox Unificado**: Centraliza WhatsApp (via Evolution API), Email e SMS.
- **Pipelines Kanban**: Múltiplos funis de vendas com drag-and-drop fluido.
- **Gestão de Vendas**: Leads, Contatos, Empresas e Negócios (Deals).
- **Design Premium**: Interface moderna, "glassmorphism", animações suaves, foco em UX.

---

## 2. Stack Tecnológica (Versões Exatas)

### Frontend

- **Framework**: Next.js 16.0.3 (App Router)
- **UI Library**: React 19.2.0
- **Linguagem**: TypeScript 5.x
- **Estilização**: Tailwind CSS 4.1.17 (Utility-first)
- **Ícones**: Lucide React 0.554.0
- **Drag & Drop**: @dnd-kit (Core, Sortable, Utilities)
- **State Management**: Zustand 5.0.8 (Global), React Query 5.90.10 (Server State)
- **Utils**: clsx, date-fns, tailwind-merge

### Backend

- **Runtime**: Node.js 20+
- **API**: Next.js API Routes (Serverless functions em `src/app/api`)
- **Database**: PostgreSQL 15+ (via Supabase)
- **ORM**: Prisma 5.22.0
- **Auth**: JWT (jose), bcryptjs
- **Integração WhatsApp**: Evolution API (Self-hosted)

---

## 3. Estrutura de Diretórios

```
CRM_Alma/
├── src/
│   ├── app/                   # Next.js App Router (Páginas e API)
│   │   ├── api/               # Backend Endpoints
│   │   ├── (auth)/            # Rotas de autenticação (login, etc)
│   │   ├── (dashboard)/       # Rotas protegidas do app principal
│   │   └── layout.tsx         # Root Layout
│   ├── components/            # React Components
│   │   ├── ui/                # Componentes base (Botões, Inputs, Cards)
│   │   ├── layout/            # Sidebar, Header
│   │   ├── inbox/             # Componentes específicos do Inbox
│   │   ├── pipeline/          # Componentes do Kanban
│   │   └── ...
│   ├── lib/                   # Utilitários e Configurações
│   │   ├── prisma.ts          # Instância do Prisma Client
│   │   ├── auth.ts            # Helpers de JWT e Auth
│   │   └── utils.ts           # Helpers genéricos (cn, formatters)
│   ├── hooks/                 # Custom React Hooks
│   └── types/                 # Definições de Tipos TypeScript globais
├── prisma/
│   └── schema.prisma          # Schema do Banco de Dados
├── public/                    # Assets estáticos
└── ...config files
```

---

## 4. Convenções de Desenvolvimento

### Design & UI

- **Estética**: "Premium SaaS". Use sombras suaves, bordas sutis, e muito whitespace.
- **Cores**:
  - Primary: Royal Blue (`#2563EB`)
  - Backgrounds: Slate/Gray muito claros (`#F8FAFC`)
  - Surface: White com transparência (`bg-white/90 backdrop-blur`)
- **Tailwind**: Use classes utilitárias. Evite CSS modules a menos que estritamente necessário para animações complexas.
- **Componentes**: Crie componentes pequenos e reutilizáveis. Use `clsx` ou `cn` para classes condicionais.

### Código (TypeScript/React)

- **Strict Mode**: TypeScript deve ser estrito. Evite `any`. Defina interfaces para props e dados.
- **Server vs Client**:
  - Use `'use client'` apenas quando necessário (interatividade, hooks).
  - Prefira Server Components para data fetching inicial.
- **Data Fetching**:
  - Use `fetch` nativo ou Prisma diretamente em Server Components.
  - Use **React Query** para data fetching em Client Components.
- **Nomes**:
  - Arquivos: `PascalCase.tsx` para componentes, `camelCase.ts` para utils/hooks.
  - Pastas: `kebab-case` ou `camelCase` (mantenha consistência com o existente).

### Banco de Dados (Prisma)

- **Schema**: Mantenha o `schema.prisma` atualizado.
- **Migrations**: Sempre crie migrations para mudanças de schema (`npx prisma migrate dev`).
- **Multi-tenancy**: **CRÍTICO**. Quase todas as queries devem filtrar por `tenantId`. Nunca esqueça disso.

---

## 5. Arquitetura de Dados (Resumo)

### Principais Modelos

- **Tenant**: A conta da empresa cliente.
- **User**: Usuário do sistema (pertence a um Tenant).
- **Contact**: Pessoa física (cliente final). Tem múltiplos telefones/emails.
- **Company**: Pessoa jurídica.
- **Pipeline**: Funil de vendas (ex: "Vendas", "Upsell").
- **Deal**: Oportunidade de negócio em um Pipeline.
- **Conversation**: Conversa no Inbox (WhatsApp, Email, etc).
- **Message**: Mensagem individual.

### Fluxo de Autenticação

1.  Login via `/api/auth/login`.
2.  JWT gerado e salvo em cookie `httpOnly`.
3.  `middleware.ts` intercepta rotas protegidas e valida o JWT.
4.  API Routes extraem o usuário do JWT para garantir acesso ao Tenant correto.

---

## 6. Integrações

### Evolution API (WhatsApp)

- Não usamos a API oficial da Meta diretamente. Usamos a **Evolution API** como gateway.
- **Webhook**: Recebe mensagens em `/api/webhooks/whatsapp`.
- **Envio**: POST para a Evolution API via `src/lib/evolution-api.ts`.
- **Setup**: Requer URL da instância e API Key no `.env`.

---

## 7. Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Rodar Prisma Studio (visualizar banco)
npx prisma studio

# Criar migration (após editar schema.prisma)
npx prisma migrate dev --name nome_da_mudanca

# Build de produção
npm run build
```

---

## 8. Roadmap & Prioridades Atuais

Consulte `ROADMAP.md` para detalhes, mas o foco atual é:

1.  **Segurança**: Garantir isolamento real de tenants e proteção CSRF.
2.  **CRUDs**: Completar as operações de criação/edição para Contatos, Empresas e Deals.
3.  **Inbox**: Melhorar suporte a mídia e notificações.
4.  **Refatoração**: Limpeza de código e padronização.

---

> **Nota para o Gemini**: Ao sugerir código, sempre verifique se está importando dos caminhos corretos (`@/components/...`, `@/lib/...`) e se está respeitando as versões das bibliotecas (ex: Next.js 16 usa App Router, não Pages Router).

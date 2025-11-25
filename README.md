# Alma CRM

> **CRM moderno focado em vendas com inbox unificado e múltiplos pipelines visuais**

Sistema de CRM completo construído para agências e empresas de tecnologia, combinando gestão de vendas profissional com comunicação centralizada estilo WhatsApp Web.

---

## 🎯 Visão Geral

Alma CRM é uma plataforma SaaS de gestão de relacionamento com clientes que se diferencia por:

### Core Features

1. **Inbox Unificado**
   - Interface estilo WhatsApp Web
   - Múltiplos canais em um só lugar (WhatsApp, Email, SMS)
   - Integração com Evolution API para WhatsApp
   - Real-time updates com polling
   - Link automático entre conversas e negócios

2. **Múltiplos Pipelines Kanban**
   - Drag-and-drop fluido
   - Pipelines ilimitados e customizáveis
   - Templates prontos (Vendas, Upsell, Renovação)
   - Gestão visual de estágios
   - Tracking de MRR e probabilidade de fechamento

3. **Gestão Completa de Vendas**
   - Leads qualificados
   - Contatos e empresas
   - Atividades e follow-ups
   - Contratos e pós-vendas
   - Multi-tenant architecture

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20+
- PostgreSQL 15+ (ou conta Supabase)
- npm ou yarn

### Instalação

```bash
# 1. Clone o repositório
git clone <repo-url>
cd CRM_Alma

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# 4. Rode o projeto (frontend-first, Tailwind v4 configless)
npm run dev
```

Acesse: **http://localhost:3000**

### Login Padrão (após seed)

```
Email: admin@alma.agency
Password: 123456
```

---

## 🛠️ Stack Tecnológica (UI)

- **React 19.2** + **Next.js 16.0** (App Router)
- **TypeScript 5.x**
- **Tailwind CSS 4.x** (configless; tokens e animações em `src/app/globals.css`)
- **@dnd-kit** para drag-and-drop
- **Lucide React** para ícones
- **React Query** (Devtools opcional com `NEXT_PUBLIC_ENABLE_RQ_DEVTOOLS=true`)

---

## 📁 Estrutura do Projeto

```
CRM_Alma/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # Backend API endpoints
│   │   │   ├── auth/          # Login/logout
│   │   │   ├── contacts/      # CRUD contatos
│   │   │   ├── companies/     # CRUD empresas
│   │   │   ├── leads/         # CRUD leads
│   │   │   ├── pipelines/     # CRUD pipelines
│   │   │   ├── deals/         # CRUD negócios
│   │   │   ├── conversations/ # Inbox conversations
│   │   │   ├── messages/      # Envio de mensagens
│   │   │   └── webhooks/      # Webhooks externos
│   │   ├── contacts/          # Página de contatos
│   │   ├── companies/         # Página de empresas
│   │   ├── leads/             # Página de leads
│   │   ├── pipeline/          # Kanban board
│   │   ├── inbox/             # Inbox unificado
│   │   ├── settings/          # Configurações
│   │   └── login/             # Autenticação
│   ├── components/            # React components
│   │   ├── layout/
│   │   ├── contacts/
│   │   ├── pipeline/
│   │   └── inbox/
│   ├── lib/                   # Utilitários
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # JWT helpers
│   │   └── evolution-api.ts   # WhatsApp integration
│   └── middleware.ts          # Auth middleware
├── prisma/
│   └── schema.prisma          # Database schema
├── .env.example               # Template de env vars
├── CLAUDE.md                  # Documentação técnica completa
├── ROADMAP.md                 # Melhorias futuras
├── INBOX_SETUP.md             # Setup Evolution API
└── ARCHITECTURE.md            # Guia atualizado de lógica e configuração (frontend-first)
```

---

## 🎨 Design System

### Paleta de Cores

O projeto usa um design system moderno baseado em **Royal Blue (#2563EB)**:

- **Primary**: Royal Blue para CTAs e elementos interativos
- **Background**: Tons de cinza claro (#F8FAFC, #FFFFFF)
- **Text**: Hierarchy com #0F172A, #475569, #94A3B8
- **Semantic**: Success (#10B981), Warning (#F59E0B), Danger (#EF4444)

### Componentes Customizados

- **Glass cards** com backdrop-blur
- **Hover lift** para interatividade
- **Focus rings** para acessibilidade
- **Animações suaves** (fade-in, slide-up, scale-in)

---

## 📊 Funcionalidades Principais

### 1. Inbox Unificado

Interface moderna estilo WhatsApp Web que centraliza todas as conversas:

- **3 painéis**: Lista de conversas | Chat ativo | Detalhes do contato
- **Filtros por canal**: WhatsApp, Email, SMS, Todos
- **Pesquisa** de conversas
- **Real-time updates** com polling (5s)
- **Envio de mensagens** com sincronização automática
- **Link para deals** relacionados
- **Badge de não lidas** por conversa

**Tecnologia**: Evolution API para WhatsApp (não usa API oficial Meta)

### 2. Pipeline Kanban

Gestão visual de vendas com drag-and-drop:

- **Múltiplos pipelines** simultâneos
- **Seletor de pipeline** no header
- **Drag-and-drop** entre estágios
- **Persistência automática** ao mover cards
- **Rollback** em caso de erro
- **Cards informativos**: título, valor MRR, empresa, tags
- **Templates prontos**:
  - Novos Negócios (5 estágios)
  - Upsell (4 estágios)
  - Renovação (4 estágios)

**Gestão**: Página de settings para criar/editar/deletar pipelines e stages

### 3. Gestão de Contatos & Empresas

- Listagem completa com filtros
- Múltiplos telefones/emails por contato (JSON)
- Link entre contatos e empresas
- Segmentação por tags
- Canal principal de comunicação

### 4. Leads & Qualificação

- Lead scoring automático
- Status tracking (Open, Qualified, Converted, Lost)
- Atribuição de responsáveis
- Origem do lead (campanhas, referências, etc.)
- Budget range e urgency para priorização

### 5. Autenticação & Segurança

- Login com email/password
- JWT com cookies httpOnly
- Middleware de proteção de rotas
- Password hashing com bcryptjs
- Multi-tenant isolation

---

## 🔌 APIs e Endpoints

### Autenticação

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### CRM Core

- `GET /api/contacts` - Lista contatos
- `GET /api/companies` - Lista empresas
- `GET /api/leads` - Lista leads

### Pipelines

- `GET /api/pipelines` - Lista todos os pipelines
- `POST /api/pipelines` - Cria novo pipeline
- `GET /api/pipelines/:id` - Busca pipeline com deals
- `PATCH /api/pipelines/:id` - Atualiza pipeline
- `DELETE /api/pipelines/:id` - Deleta pipeline
- `PATCH /api/deals/:id` - Atualiza deal (ex: mover stage)

### Inbox

- `GET /api/conversations` - Lista conversas com mensagens
- `POST /api/messages` - Envia mensagem
- `POST /api/webhooks/whatsapp` - Webhook Evolution API

**Documentação completa**: Ver [CLAUDE.md](./CLAUDE.md)

---

## 🔗 Integração WhatsApp (Evolution API)

### Configuração

1. Instale/configure sua instância do Evolution API
2. Configure as variáveis no `.env`:

```bash
EVOLUTION_API_URL="https://your-evolution-api.com/api/v1"
EVOLUTION_API_KEY="your_api_key_here"
EVOLUTION_INSTANCE_NAME="your_instance_name"
WEBHOOK_API_KEY="random_secret_for_webhook"
```

3. Configure o webhook na Evolution API:

```
URL: https://your-domain.com/api/webhooks/whatsapp
Header: x-api-key: your_webhook_secret
Events: messages.upsert
```

4. Teste o envio de mensagens pelo inbox!

**Guia completo**: Ver [INBOX_SETUP.md](./INBOX_SETUP.md)

---

## 🗄️ Database Schema

O projeto usa **PostgreSQL** com **Prisma ORM**.

### Principais Modelos:

- **Tenant**: Multi-tenancy + branding
- **User**: Autenticação e permissões
- **Contact**: Contatos com múltiplos telefones/emails
- **Company**: Empresas e segmentação
- **Lead**: Leads qualificados
- **Pipeline**: Funis de vendas customizáveis
- **Stage**: Estágios dos pipelines
- **Deal**: Negócios em andamento
- **Conversation**: Conversas multi-canal
- **Message**: Mensagens (inbound/outbound)
- **Activity**: Tarefas e follow-ups
- **Contract**: Contratos pós-venda
- **ClientAccount**: Gestão de clientes ativos

**Diagrama completo**: Ver [CLAUDE.md](./CLAUDE.md#estrutura-do-banco-de-dados)

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_SECRET`
   - `EVOLUTION_API_URL`
   - `EVOLUTION_API_KEY`
   - `EVOLUTION_INSTANCE_NAME`
   - `WEBHOOK_API_KEY`

3. Deploy automático em cada push!

### Outras plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:

- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

---

## 🧪 Testes

**Endpoints para testar**:

```bash
# Contatos
curl http://localhost:3000/api/contacts

# Pipelines
curl http://localhost:3000/api/pipelines

# Conversas (requer autenticação)
curl http://localhost:3000/api/conversations \
  -H "Cookie: auth-token=<your-token>"
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Convenções

- **Commits**: Use conventional commits (feat:, fix:, docs:, refactor:)
- **Código**: TypeScript estrito, Tailwind CSS, Prettier formatting
- **Testes**: Adicione testes para novas features (futuro)

---

## 📝 Documentação Adicional

- **[CLAUDE.md](./CLAUDE.md)**: Documentação técnica completa end-to-end
- **[ROADMAP.md](./ROADMAP.md)**: Melhorias e features futuras planejadas
- **[INBOX_SETUP.md](./INBOX_SETUP.md)**: Guia detalhado de setup da Evolution API

---

## 🎯 Roadmap

Principais features planejadas:

- [ ] Real-time com WebSockets
- [ ] Notificações push
- [ ] Automações e workflows
- [ ] Relatórios e dashboards
- [ ] Mobile app (React Native)
- [ ] Integrações: Email, SMS, Instagram, Telegram
- [ ] AI assistente para qualificação de leads
- [ ] Calendário integrado
- [ ] Sistema de permissões granulares

**Roadmap completo**: Ver [ROADMAP.md](./ROADMAP.md)

---

## 📄 Licença

Proprietary - Alma Agency © 2025

---

## 📧 Contato

- **Website**: https://alma.agency
- **Email**: contato@alma.agency
- **GitHub**: [Alma Agency](https://github.com/alma-agency)

---

## 🙏 Agradecimentos

- **Next.js** pela excelente framework full-stack
- **Prisma** pelo ORM type-safe
- **Tailwind CSS** pelo design system moderno
- **@dnd-kit** pela biblioteca de drag-and-drop
- **Supabase** pela infraestrutura de database

---

**Desenvolvido com ❤️ pela Alma Agency**

# CLAUDE.md - Documentação Técnica Completa

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
4. [Módulos e Funcionalidades](#módulos-e-funcionalidades)
5. [APIs e Endpoints](#apis-e-endpoints)
6. [Integrações Externas](#integrações-externas)
7. [Sistema de Design](#sistema-de-design)
8. [Autenticação e Segurança](#autenticação-e-segurança)
9. [Fluxos de Dados](#fluxos-de-dados)
10. [Guia de Desenvolvimento](#guia-de-desenvolvimento)

---

## Visão Geral da Arquitetura

### Arquitetura Multi-Tenant

O Alma CRM é construído com arquitetura **multi-tenant**, permitindo que múltiplas empresas (tenants) utilizem a mesma infraestrutura de forma isolada.

```
┌─────────────────────────────────────────────────────┐
│                   ALMA CRM                          │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Tenant 1   │  │   Tenant 2   │  │ Tenant N │ │
│  │ alma.agency  │  │ cliente.com  │  │   ...    │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│         │                 │                 │      │
│         └─────────────────┴─────────────────┘      │
│                          │                         │
│              ┌───────────▼──────────┐              │
│              │  Database (Postgres) │              │
│              │   (Tenant Isolation) │              │
│              └──────────────────────┘              │
└─────────────────────────────────────────────────────┘
```

### Padrão de Camadas

```
┌────────────────────────────────────────┐
│     UI Layer (React Components)        │
│  - Tailwind CSS styling                │
│  - Client-side interactivity           │
└────────────┬───────────────────────────┘
             │
┌────────────▼───────────────────────────┐
│   API Layer (Next.js Route Handlers)   │
│  - RESTful endpoints                   │
│  - Authentication middleware           │
│  - Business logic                      │
└────────────┬───────────────────────────┘
             │
┌────────────▼───────────────────────────┐
│   Data Layer (Prisma ORM)              │
│  - Type-safe database queries          │
│  - Migration management                │
│  - Relationship handling               │
└────────────┬───────────────────────────┘
             │
┌────────────▼───────────────────────────┐
│   Database (PostgreSQL/Supabase)       │
│  - Persistent data storage             │
│  - Multi-tenant data isolation         │
└────────────────────────────────────────┘
```

---

## Stack Tecnológica

### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 19.2.0 | Framework UI principal |
| **Next.js** | 16.0.3 | Framework full-stack com App Router |
| **TypeScript** | 5.x | Type safety e developer experience |
| **Tailwind CSS** | 4.1.17 | Sistema de design utility-first |
| **Lucide React** | 0.554.0 | Biblioteca de ícones modernos |
| **@dnd-kit** | 6.3.1 | Drag-and-drop para Kanban |
| **clsx** | 2.1.1 | Utilitário para classes condicionais |
| **date-fns** | 4.1.0 | Manipulação de datas |

### Backend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | 20.x | Runtime JavaScript |
| **Next.js API Routes** | 16.0.3 | API RESTful serverless |
| **Prisma ORM** | 5.22.0 | Database ORM type-safe |
| **PostgreSQL** | 15+ | Banco de dados relacional |
| **Supabase** | - | Database hosting e pooling |
| **jose** | 6.1.2 | JWT authentication |
| **bcryptjs** | 3.0.3 | Password hashing |

### Infraestrutura

- **Database**: PostgreSQL via Supabase (connection pooling)
- **Deployment**: Vercel (recomendado)
- **WhatsApp Integration**: Evolution API (third-party)

---

## Estrutura do Banco de Dados

### Diagrama ER Simplificado

```
┌──────────┐
│  Tenant  │
└────┬─────┘
     │
     ├─────────────────────────────────────────────┐
     │                                             │
┌────▼────┐    ┌─────────┐    ┌──────────┐   ┌───▼──────┐
│  User   │    │ Contact │    │ Company  │   │ Pipeline │
└────┬────┘    └────┬────┘    └────┬─────┘   └────┬─────┘
     │              │              │              │
     │         ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
     │         │  Lead   │    │  Deal   │    │  Stage  │
     │         └────┬────┘    └────┬────┘    └─────────┘
     │              │              │
     │         ┌────▼──────────────▼────┐
     │         │    Conversation        │
     │         └────────┬───────────────┘
     │                  │
     └──────────────────▼
             ┌──────────────┐
             │   Message    │
             └──────────────┘
```

### Modelos Principais

#### 1. **Tenant** (Multi-tenancy)
```prisma
model Tenant {
  id        String   @id @default(uuid())
  name      String
  domain    String   @unique

  // Branding customization
  logoDarkHorizontalUrl  String?
  primaryColor           String @default("#000000")

  // Relations
  users            User[]
  contacts         Contact[]
  companies        Company[]
  pipelines        Pipeline[]
  conversations    Conversation[]
}
```

**Propósito**: Isolamento de dados entre clientes. Cada tenant possui seus próprios usuários, contatos, empresas e pipelines.

#### 2. **User** (Gestão de Usuários)
```prisma
model User {
  id        String   @id @default(uuid())
  tenantId  String
  name      String
  email     String   @unique
  password  String
  role      String   @default("SALES_REP")

  // Relations
  ownedLeads         Lead[]
  ownedDeals         Deal[]
  sentMessages       Message[]
}
```

**Propósito**: Autenticação e autorização. Controle de acesso baseado em roles.

#### 3. **Contact** (Contatos)
```prisma
model Contact {
  id          String   @id @default(uuid())
  tenantId    String
  companyId   String?
  name        String
  jobTitle    String?
  mainChannel String?
  phones      String // JSON: ["5511999999999"]
  emails      String // JSON: ["email@example.com"]

  // Relations
  leads         Lead[]
  deals         Deal[]
  conversations Conversation[]
  messages      Message[]
}
```

**Propósito**: Armazenar informações de contato de leads e clientes. Suporta múltiplos telefones/emails via JSON.

#### 4. **Company** (Empresas)
```prisma
model Company {
  id        String   @id @default(uuid())
  tenantId  String
  name      String
  segment   String?
  size      String?
  website   String?
  tags      String // JSON ou comma-separated

  // Relations
  contacts       Contact[]
  leads          Lead[]
  deals          Deal[]
}
```

**Propósito**: Contexto organizacional para contatos e negócios.

#### 5. **Lead** (Leads de Vendas)
```prisma
model Lead {
  id               String   @id @default(uuid())
  tenantId         String
  companyId        String?
  primaryContactId String?
  ownerId          String?

  status           String   @default("OPEN")
  sourceType       String

  // Qualification
  budgetRange      String?
  urgency          String?
  leadScore        Int      @default(0)

  // Relations
  deals            Deal[]
  activities       Activity[]
}
```

**Propósito**: Gerenciamento de leads qualificados antes de virarem deals.

#### 6. **Pipeline & Stage** (Funil de Vendas)
```prisma
model Pipeline {
  id       String   @id @default(uuid())
  tenantId String
  name     String
  type     String // NEW_BUSINESS, UPSELL, RENEWAL, CUSTOM

  stages   Stage[]
  deals    Deal[]
}

model Stage {
  id                 String   @id @default(uuid())
  pipelineId         String
  name               String
  orderIndex         Int
  defaultProbability Int?

  deals              Deal[]
}
```

**Propósito**: Estruturação de múltiplos funis de vendas com estágios customizáveis.

**Templates Disponíveis**:
- **NEW_BUSINESS**: Lead Qualificado → Reunião → Proposta → Negociação → Fechado
- **UPSELL**: Oportunidade → Análise → Proposta → Fechado
- **RENEWAL**: Em Renovação → Negociação → Fechado → Perdido

#### 7. **Deal** (Negócios)
```prisma
model Deal {
  id               String   @id @default(uuid())
  tenantId         String
  pipelineId       String
  stageId          String

  title            String
  expectedMRR      Decimal?
  expectedOneOff   Decimal?
  probability      Int?
  expectedCloseDate DateTime?

  status           String   @default("OPEN")

  // Relations
  pipeline         Pipeline
  stage            Stage
  activities       Activity[]
  conversations    Conversation[]
}
```

**Propósito**: Representa oportunidades de vendas em um pipeline específico.

#### 8. **Conversation & Message** (Inbox Unificado)
```prisma
model Conversation {
  id              String   @id @default(uuid())
  tenantId        String
  contactId       String?

  channelType     String   // WHATSAPP, EMAIL, SMS, etc.
  status          String   @default("OPEN")
  unreadCount     Int      @default(0)
  lastMessageAt   DateTime @default(now())

  linkedDealId    String?

  messages        Message[]
}

model Message {
  id              String   @id @default(uuid())
  tenantId        String
  conversationId  String

  channelType     String
  direction       String   // INBOUND, OUTBOUND

  senderId        String?  // User ID (if outbound)
  contactId       String?  // Contact ID (if inbound)

  content         String
  mediaUrl        String?
  mediaType       String?

  timestamp       DateTime @default(now())
}
```

**Propósito**: Inbox unificado estilo WhatsApp Web. Centraliza todas as conversas de múltiplos canais.

---

## Módulos e Funcionalidades

### 1. Dashboard (Home)

**Arquivo**: `src/app/page.tsx`

**Funcionalidades**:
- Visão geral de métricas (placeholder)
- Acesso rápido aos módulos principais

### 2. Inbox Unificado

**Arquivos Principais**:
- `src/app/inbox/page.tsx`
- `src/components/inbox/InboxLayout.tsx`

**Funcionalidades**:
- Interface estilo WhatsApp Web
- 3 painéis: Lista de conversas | Chat | Detalhes do contato
- Filtros por canal (WhatsApp, Email, SMS)
- Pesquisa de conversas
- Envio de mensagens de texto
- Polling automático a cada 5 segundos
- Auto-scroll para última mensagem
- Indicador de mensagens não lidas
- Link para deal associado

**Fluxo de Dados**:
```
┌──────────────┐
│ Evolution API│ (WhatsApp)
└──────┬───────┘
       │ webhook
       ▼
┌──────────────────────┐
│ /api/webhooks/whatsapp│
│  - Create contact    │
│  - Create conversation│
│  - Create message    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐      ┌──────────────┐
│ GET /api/conversations│◄──│ InboxLayout  │
│   (polling 5s)   │      │  Component   │
└──────────────────┘      └──────┬───────┘
                                 │
                          (user sends msg)
                                 │
                                 ▼
                        ┌────────────────┐
                        │ POST /api/messages│
                        │ - Save to DB   │
                        │ - Forward to   │
                        │   Evolution API│
                        └────────────────┘
```

### 3. Pipeline Kanban (Múltiplos)

**Arquivos Principais**:
- `src/app/pipeline/page.tsx`
- `src/components/pipeline/PipelineBoard.tsx`
- `src/app/settings/pipelines/page.tsx`

**Funcionalidades**:
- Visualização Kanban drag-and-drop
- Seletor de pipeline no header (dropdown)
- Drag-and-drop entre estágios
- Persistência automática ao mover deal
- Rollback em caso de erro de API
- Cards com: título, valor MRR, empresa, tags
- Link para gerenciamento de pipelines

**Componentes**:
```typescript
// PipelineBoard.tsx
- DealCard (sortable)
- PipelineColumn (droppable)
- Pipeline selector dropdown
- Click-outside handler

// Drag-and-drop handlers:
- handleDragStart: Salva snapshot
- handleDragOver: Update UI otimista
- handleDragEnd: Persiste via PATCH /api/deals/:id
```

**Gestão de Pipelines** (`/settings/pipelines`):
- Criar novo pipeline
- Editar pipeline existente
- Deletar pipeline (se não tiver deals)
- Adicionar/remover/reordenar stages
- Templates prontos (NEW_BUSINESS, UPSELL, RENEWAL)
- Drag-to-reorder stages

### 4. Contatos

**Arquivos Principais**:
- `src/app/contacts/page.tsx`
- `src/components/contacts/ContactList.tsx`

**Funcionalidades**:
- Listagem de contatos
- Filtros e pesquisa (placeholder)
- Exibição de canal principal, telefone, email
- Link para empresa associada

### 5. Empresas

**Arquivos Principais**:
- `src/app/companies/page.tsx`
- `src/components/companies/CompanyList.tsx`

**Funcionalidades**:
- Listagem de empresas
- Exibição de segmento, site, tags
- Contador de contatos associados

### 6. Leads

**Arquivos Principais**:
- `src/app/leads/page.tsx`
- `src/components/leads/LeadList.tsx`

**Funcionalidades**:
- Listagem de leads
- Status badges (OPEN, QUALIFIED, CONVERTED, LOST)
- Lead score visual
- Origem do lead
- Owner assignment

### 7. Autenticação

**Arquivos Principais**:
- `src/app/login/page.tsx`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/lib/auth.ts`
- `src/middleware.ts`

**Funcionalidades**:
- Login com email/password
- Password hashing com bcryptjs
- JWT com jose (ES256)
- Cookie httpOnly para token
- Proteção de rotas via middleware
- Auto-redirect para /login se não autenticado

**Fluxo de Autenticação**:
```
┌──────────┐
│  User    │
└────┬─────┘
     │ POST /api/auth/login
     │ { email, password }
     ▼
┌────────────────────┐
│ Login API Route    │
│ 1. Validate creds  │
│ 2. bcrypt.compare  │
│ 3. Generate JWT    │
│ 4. Set httpOnly    │
│    cookie          │
└────┬───────────────┘
     │
     ▼
┌────────────────────┐
│  Middleware.ts     │
│ - Check JWT cookie │
│ - Verify signature │
│ - Allow/Redirect   │
└────────────────────┘
```

---

## APIs e Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login de usuário |
| POST | `/api/auth/logout` | Logout (clear cookie) |

### Contatos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/contacts` | Lista todos os contatos do tenant |

### Empresas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/companies` | Lista todas as empresas do tenant |

### Leads

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/leads` | Lista todos os leads do tenant |

### Pipelines

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pipelines` | Lista todos os pipelines |
| POST | `/api/pipelines` | Cria novo pipeline com stages |
| GET | `/api/pipelines/:id` | Busca pipeline com stages e deals |
| PATCH | `/api/pipelines/:id` | Atualiza pipeline e stages |
| DELETE | `/api/pipelines/:id` | Deleta pipeline (se não tiver deals) |

**Exemplo de criação de pipeline**:
```json
POST /api/pipelines
{
  "name": "Novos Negócios",
  "type": "NEW_BUSINESS",
  "stages": [
    { "name": "Lead Qualificado", "defaultProbability": 10 },
    { "name": "Reunião Agendada", "defaultProbability": 25 },
    { "name": "Proposta Enviada", "defaultProbability": 50 }
  ]
}
```

### Deals

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| PATCH | `/api/deals/:id` | Atualiza deal (ex: mover stage) |

**Exemplo de movimentação de deal**:
```json
PATCH /api/deals/abc123
{
  "stageId": "xyz789"
}
```

### Inbox & Mensagens

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/conversations` | Lista conversas com mensagens |
| POST | `/api/messages` | Envia mensagem (salva + encaminha) |
| POST | `/api/webhooks/whatsapp` | Webhook para Evolution API |
| GET | `/api/webhooks/whatsapp` | Health check do webhook |

**Exemplo de envio de mensagem**:
```json
POST /api/messages
{
  "conversationId": "conv123",
  "content": "Olá! Como posso ajudar?",
  "mediaUrl": null,
  "mediaType": null
}
```

**Response**:
```json
{
  "id": "msg456",
  "conversationId": "conv123",
  "content": "Olá! Como posso ajudar?",
  "direction": "OUTBOUND",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

---

## Integrações Externas

### Evolution API (WhatsApp)

**Arquivo**: `src/lib/evolution-api.ts`

**Configuração** (`.env`):
```bash
EVOLUTION_API_URL="https://your-evolution-api.com/api/v1"
EVOLUTION_API_KEY="your_api_key_here"
EVOLUTION_INSTANCE_NAME="your_instance_name"
WEBHOOK_API_KEY="your_webhook_secret"
```

**Funções Disponíveis**:

```typescript
// Enviar mensagem de texto
sendWhatsAppTextMessage({
  number: "5511999999999",
  text: "Olá!"
})

// Enviar mídia
sendWhatsAppMediaMessage({
  number: "5511999999999",
  mediaUrl: "https://example.com/image.jpg",
  caption: "Confira esta imagem",
  mediaType: "image"
})

// Formatar telefone
formatPhoneNumber("11999999999") // → "5511999999999"

// Verificar status da instância
getInstanceStatus()
```

**Fluxo de Webhook**:

1. Evolution API recebe mensagem do WhatsApp
2. Envia POST para `/api/webhooks/whatsapp`
3. Webhook valida API key no header `x-api-key`
4. Extrai dados da mensagem
5. Busca/cria Contact
6. Busca/cria Conversation
7. Cria Message (INBOUND)
8. Incrementa unreadCount

**Formato do Payload do Webhook**:
```json
{
  "event": "messages.upsert",
  "instance": "instance_name",
  "data": {
    "key": {
      "remoteJid": "5511999999999@s.whatsapp.net",
      "fromMe": false,
      "id": "message_id"
    },
    "pushName": "João Silva",
    "message": {
      "conversation": "Olá, gostaria de saber mais"
    },
    "messageTimestamp": 1234567890
  }
}
```

**Documentação Completa**: Ver `INBOX_SETUP.md`

---

## Sistema de Design

### Paleta de Cores (Design System 2025)

**Arquivo**: `src/app/globals.css` + `tailwind.config.ts`

#### Cores Primárias
```css
--primary-color: #2563EB        /* Royal Blue */
--primary-hover: #1D4ED8
--primary-active: #1E40AF
--primary-light: #DBEAFE
--primary-dark: #1E3A8A
```

#### Cores de Background
```css
--bg-app: #F8FAFC             /* App background */
--bg-surface: #FFFFFF         /* Cards, modals */
--bg-surface-hover: #F1F5F9   /* Hover states */
--bg-border: #E2E8F0          /* Borders, dividers */
```

#### Cores de Texto
```css
--text-primary: #0F172A       /* Headings */
--text-secondary: #475569     /* Body text */
--text-tertiary: #94A3B8      /* Muted text */
--text-on-primary: #FFFFFF    /* Text on blue */
```

#### Cores Semânticas
```css
--success: #10B981
--warning: #F59E0B
--danger: #EF4444
--info: #3B82F6
```

### Componentes Reutilizáveis

#### Glass Card
```html
<div class="glass-card">
  <!-- Content -->
</div>
```
```css
.glass-card {
  @apply bg-white/90 backdrop-blur-sm border border-bg-border rounded-lg shadow-sm;
}
```

#### Hover Lift
```html
<button class="hover-lift">
  Click me
</button>
```
```css
.hover-lift {
  @apply transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md;
}
```

#### Focus Ring
```html
<input class="focus-ring" />
```
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
}
```

### Animações

```typescript
// tailwind.config.ts
animation: {
  'fade-in': 'fadeIn 0.2s ease-in',
  'slide-up': 'slideUp 0.3s ease-out',
  'scale-in': 'scaleIn 0.2s ease-out',
}

keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideUp: {
    '0%': { transform: 'translateY(10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  scaleIn: {
    '0%': { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
}
```

---

## Autenticação e Segurança

### JWT Flow

**Geração de Token**:
```typescript
// src/lib/auth.ts
import * as jose from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(payload: TokenPayload) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}
```

**Verificação de Token**:
```typescript
export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}
```

### Middleware de Proteção

**Arquivo**: `src/middleware.ts`

```typescript
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/contacts/:path*',
    '/companies/:path*',
    '/pipeline/:path*',
    '/inbox/:path*',
    // ... todas as rotas protegidas
  ]
};
```

### Password Hashing

```typescript
import bcrypt from 'bcryptjs';

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, user.password);
```

### CSRF Protection (Futuro)

**Arquivo**: `src/lib/csrf.ts` (Placeholder para implementação futura)

---

## Fluxos de Dados

### 1. Fluxo de Login

```
User Input (email/password)
    │
    ▼
POST /api/auth/login
    │
    ├─► Buscar User no DB
    │   ├─► Não encontrado → 401 Unauthorized
    │   └─► Encontrado
    │       │
    │       ▼
    │   bcrypt.compare(password, hash)
    │       │
    │       ├─► Inválido → 401 Unauthorized
    │       └─► Válido
    │           │
    │           ▼
    │       generateToken({ userId, tenantId, email })
    │           │
    │           ▼
    │       Set Cookie (httpOnly, sameSite: 'lax')
    │           │
    │           ▼
    │       Return 200 OK
    │
    ▼
Redirect to Dashboard
```

### 2. Fluxo de Mensagem Inbound (WhatsApp)

```
WhatsApp → Evolution API
              │
              ▼
    POST /api/webhooks/whatsapp
    (Header: x-api-key)
              │
              ├─► Validar API Key
              │   └─► Inválido → 401
              │
              ├─► Verificar event === "messages.upsert"
              │   └─► Ignorar se fromMe === true
              │
              ├─► Extrair phoneNumber, senderName, content
              │
              ├─► Buscar Contact por phoneNumber
              │   └─► Se não existe → Criar Contact
              │
              ├─► Buscar Conversation (contactId + WHATSAPP)
              │   └─► Se não existe → Criar Conversation
              │
              ├─► Criar Message (direction: INBOUND)
              │
              └─► Atualizar Conversation
                  (lastMessageAt, increment unreadCount)
```

### 3. Fluxo de Mensagem Outbound (WhatsApp)

```
User digita mensagem no Inbox
              │
              ▼
    POST /api/messages
    { conversationId, content }
              │
              ├─► Buscar Conversation (validar)
              │
              ├─► Criar Message no DB
              │   (direction: OUTBOUND, senderId: userId)
              │
              ├─► Atualizar Conversation
              │   (lastMessageAt, reset unreadCount)
              │
              ├─► Se channelType === WHATSAPP
              │   │
              │   └─► Chamar evolution-api.ts
              │       sendWhatsAppTextMessage({
              │         number: formatPhoneNumber(phone),
              │         text: content
              │       })
              │       │
              │       └─► POST Evolution API
              │           └─► Evolution API → WhatsApp
              │
              └─► Return 201 Created (message)
```

### 4. Fluxo de Drag-and-Drop de Deal

```
User arrasta DealCard entre colunas
              │
              ▼
    handleDragStart()
    - Salvar snapshot de columns
    - Setar activeDeal
              │
              ▼
    handleDragOver()
    - Calcular nova posição
    - Atualizar UI otimisticamente
    - Mover deal entre arrays
              │
              ▼
    handleDragEnd()
    - Limpar activeDeal
    - Identificar overColumn
              │
              ├─► PATCH /api/deals/:id
              │   { stageId: newStageId }
              │   │
              │   ├─► Sucesso
              │   │   └─► Manter UI atualizada
              │   │
              │   └─► Erro
              │       └─► Rollback para snapshot
              │
              └─► Finalizar
```

---

## Guia de Desenvolvimento

### Setup Inicial

1. **Clone o repositório**
```bash
git clone <repo-url>
cd CRM_Alma
```

2. **Instalar dependências**
```bash
npm install
```

3. **Configurar variáveis de ambiente**
```bash
cp .env.example .env
```

Editar `.env`:
```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="random_secret_here"
EVOLUTION_API_URL="https://..."
EVOLUTION_API_KEY="..."
EVOLUTION_INSTANCE_NAME="..."
WEBHOOK_API_KEY="..."
```

4. **Executar migrations**
```bash
npx prisma migrate dev
```

5. **Seed inicial** (opcional)
```bash
npx prisma db seed
```

6. **Rodar em desenvolvimento**
```bash
npm run dev
```

Acesse: `http://localhost:3000`

### Estrutura de Pastas

```
CRM_Alma/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/
│   │   │   ├── contacts/
│   │   │   ├── companies/
│   │   │   ├── leads/
│   │   │   ├── pipelines/
│   │   │   ├── deals/
│   │   │   ├── conversations/
│   │   │   ├── messages/
│   │   │   └── webhooks/
│   │   ├── contacts/
│   │   ├── companies/
│   │   ├── leads/
│   │   ├── pipeline/
│   │   ├── inbox/
│   │   ├── settings/
│   │   ├── login/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/            # React Components
│   │   ├── layout/
│   │   │   └── Sidebar.tsx
│   │   ├── contacts/
│   │   ├── companies/
│   │   ├── leads/
│   │   ├── pipeline/
│   │   │   └── PipelineBoard.tsx
│   │   └── inbox/
│   │       └── InboxLayout.tsx
│   ├── lib/                   # Utilities
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── csrf.ts
│   │   └── evolution-api.ts
│   ├── services/
│   │   └── tenant.service.ts
│   └── middleware.ts          # Auth middleware
├── tailwind.config.ts
├── package.json
├── .env.example
├── CLAUDE.md                  # This file
├── README.md
├── ROADMAP.md
└── INBOX_SETUP.md
```

### Criando Novos Endpoints

**Template para novo endpoint**:

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 1. Extract tenant (from session/auth - future)
    const tenant = await prisma.tenant.findFirst({
      where: { domain: 'alma.agency' }
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    // 2. Query database
    const data = await prisma.yourModel.findMany({
      where: { tenantId: tenant.id },
      include: { /* relations */ }
    });

    // 3. Return response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
```

### Adicionando Novos Modelos ao Schema

1. Editar `prisma/schema.prisma`
2. Adicionar relacionamento com Tenant
3. Criar migration:
```bash
npx prisma migrate dev --name add_new_model
```
4. Regenerar Prisma Client:
```bash
npx prisma generate
```

### Testando a Aplicação

**Login padrão** (após seed):
```
Email: admin@alma.agency
Password: 123456
```

**Endpoints para testar**:
- GET `/api/contacts` → Lista contatos
- GET `/api/companies` → Lista empresas
- GET `/api/pipelines` → Lista pipelines
- GET `/api/conversations` → Lista conversas

### Deploy (Vercel)

1. Conectar repositório no Vercel
2. Configurar variáveis de ambiente
3. Deploy automático em cada push

**Configurações importantes**:
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

---

## Troubleshooting

### Erro: "Tenant not found"

**Causa**: Seed não executado ou tenant não criado

**Solução**:
```bash
npx prisma db seed
```

### Erro: "Evolution API connection failed"

**Causa**: Variáveis de ambiente incorretas ou instância inativa

**Solução**:
1. Verificar `.env`: `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE_NAME`
2. Testar:
```typescript
const status = await getInstanceStatus();
console.log(status);
```

### Erro: "Unauthorized" ao acessar rotas

**Causa**: Token JWT inválido ou expirado

**Solução**:
1. Fazer logout: `POST /api/auth/logout`
2. Fazer login novamente
3. Verificar `JWT_SECRET` no `.env`

### Drag-and-drop não funciona

**Causa**: Conflito de z-index ou problema com @dnd-kit

**Solução**:
1. Verificar `DragOverlay` está renderizado
2. Verificar `sensors` estão configurados
3. Console errors no navegador

---

## Performance & Otimizações

### Database Queries

- **Use `include` com parcimônia**: Só carregar relacionamentos necessários
- **Indexação**: Adicionar indexes em campos frequentemente filtrados
- **Pagination**: Implementar para listas grandes (futuro)

### Frontend

- **React Server Components**: Usar quando possível para reduzir bundle
- **Dynamic imports**: Lazy load componentes pesados
- **Image optimization**: Usar `next/image` para uploads de mídia (futuro)

### Caching

- **Route handlers**: Considerar cache de respostas estáticas
- **SWR/React Query**: Implementar para polling inteligente (futuro)

---

## Convenções de Código

### TypeScript

- Sempre tipar props de componentes
- Evitar `any` (usar `unknown` se necessário)
- Criar interfaces para objetos complexos

### Naming

- **Componentes**: PascalCase (`ContactList.tsx`)
- **Funções**: camelCase (`fetchContacts()`)
- **Constantes**: UPPER_SNAKE_CASE (`PIPELINE_TEMPLATES`)
- **Arquivos API**: `route.ts` (Next.js convention)

### Git Commits

```
feat: Adiciona seletor de pipeline
fix: Corrige bug de drag-and-drop
refactor: Melhora performance do inbox
docs: Atualiza documentação de API
```

---

## Referências Externas

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **@dnd-kit**: https://docs.dndkit.com
- **Evolution API**: (documentação do provider)
- **jose (JWT)**: https://github.com/panva/jose

---

**Última atualização**: 2025-01-20
**Versão do projeto**: 0.1.0
**Mantenedor**: Alma Agency

# CRM Alma

Um sistema moderno e abrangente de Customer Relationship Management (CRM) construído com Next.js 16, projetado para otimizar processos de vendas, gerenciar relacionamentos com clientes e fornecer análises acionáveis.

## 🚀 Funcionalidades

### Core CRM
-   **Suporte Multi-Tenancy**: Construído desde o início para suportar múltiplas organizações (Tenants) com isolamento de dados.
-   **Gerenciamento de Empresas e Contatos**: Base de dados centralizada para todos os seus relacionamentos de negócios.
-   **Sales Pipeline**: Pipeline visual estilo Kanban para gerenciar Leads e Deals através de vários estágios.
-   **Rastreamento de Atividades**: Registre ligações, reuniões e tarefas associadas a leads e deals.

### Comunicação & Inbox
-   **Inbox Unificado**: Gerencie conversas de múltiplos canais em um único lugar.
-   **Histórico de Mensagens**: Histórico completo de interações vinculadas a contatos e deals.

### Financeiro & Pós-Vendas
-   **Contas de Clientes**: Gerencie assinaturas ativas de clientes e pontuações de saúde.
-   **Gerenciamento de Contratos**: Acompanhe termos de contrato, renovações e datas.
-   **Rastreamento de MRR**: Monitore Monthly Recurring Revenue (MRR) e crescimento financeiro.

### Analytics & Dashboard
-   **Dashboard em Tempo Real**: Visão geral dos principais indicadores de performance (KPIs).
-   **Gráficos Visuais**: Gráficos interativos com Recharts para visualização de dados.

### Segurança & Tecnologia
-   **Autenticação Segura**: Sistema de autenticação customizado baseado em JWT com hash seguro de senhas.
-   **Controle de Acesso Baseado em Funções**: Suporte para diferentes funções de usuário (ex: Sales Rep, Admin).
-   **Stack Moderna**: Construído com Next.js 16 App Router e React 19 mais recentes.

## 🛠 Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [Supabase Postgres](https://supabase.com/) via [Prisma ORM](https://www.prisma.io/)
-   **Styling**: CSS Modules com Native CSS Variables para temas
-   **Ícones**: [Lucide React](https://lucide.dev/)
-   **Gráficos**: [Recharts](https://recharts.org/)
-   **Drag & Drop**: [dnd-kit](https://dndkit.com/)
-   **Authentication**: `jose` (JWT) & `bcryptjs`

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter os seguintes itens instalados:
-   [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
-   npm, yarn, pnpm, ou bun

## 🚀 Começando

1.  **Clone o repositório**
    ```bash
    git clone <repository-url>
    cd CRM_Alma
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Configuração do Environment**
    Copie `.env.example` para `.env` e preencha com as strings do seu projeto Supabase (Settings > Database > Connection string > Prisma):
    ```env
    DATABASE_URL="postgresql://postgres:<PASSWORD>@db.<PROJECT>.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
    DIRECT_URL="postgresql://postgres:<PASSWORD>@db.<PROJECT>.supabase.co:5432/postgres"
    JWT_SECRET="your-super-secret-key"
    ```
    - `DATABASE_URL`: usa o pool (porta 6543) recomendado para a aplicação.
    - `DIRECT_URL`: usa a conexão direta (porta 5432) para migrations/seeds do Prisma.

4.  **Configuração do Database**
    Execute o push do schema Prisma apontando para o banco Supabase:
    ```bash
    npx prisma db push
    ```

5.  **Execute o Servidor de Desenvolvimento**
    ```bash
    npm run dev
    ```

    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## 📂 Estrutura do Projeto

```
src/
├── app/                # Páginas e layouts do Next.js App Router
│   ├── api/            # Rotas da API backend
│   ├── (auth)/         # Rotas de autenticação (login, etc.)
│   ├── dashboard/      # Visualizações do dashboard principal
│   └── ...
├── components/         # Componentes de UI reutilizáveis
├── lib/                # Funções utilitárias e lógica compartilhada
├── services/           # Lógica de negócio e camada de acesso a dados
└── middleware.ts       # Edge middleware para proteção de autenticação
prisma/
└── schema.prisma       # Definição do schema do database
```

## 📜 Scripts

-   `npm run dev`: Inicia o servidor de desenvolvimento.
-   `npm run build`: Compila a aplicação para produção.
-   `npm run start`: Executa a aplicação compilada para produção.
-   `npm run lint`: Executa o ESLint para verificar problemas de qualidade de código.

## 📄 Licença

Este projeto é proprietário e confidencial. A cópia não autorizada deste arquivo, por qualquer meio, é estritamente proibida.

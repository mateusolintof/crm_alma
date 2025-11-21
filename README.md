# Alma CRM - Edição Profissional

**Alma CRM** é um sistema de Gestão de Relacionamento com o Cliente (CRM) multi-inquilino (multi-tenant) especializado, projetado especificamente para **Agências de Marketing**. Ele unifica a comunicação, funis de vendas e gestão de clientes em uma interface única e profissional.

![Banner Alma CRM](https://via.placeholder.com/1200x400/2563EB/FFFFFF?text=Alma+CRM+|+Edição+Profissional)

---

## 📖 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Principais Funcionalidades](#-principais-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Começando](#-começando)
    - [Pré-requisitos](#pré-requisitos)
    - [Instalação](#instalação)
    - [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Guia de Uso](#-guia-de-uso)
    - [Credenciais de Login](#credenciais-de-login)
    - [Módulos Principais](#módulos-principais)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Design System](#-design-system)

---

## 🚀 Sobre o Projeto

O Alma CRM foi construído para resolver o problema de fragmentação enfrentado pelas agências. Em vez de alternar entre WhatsApp, Trello e Planilhas, o Alma fornece um **hub centralizado** para:
*   **Inbox Unificado**: Gerencie todas as conversas com clientes em um só lugar.
*   **Funis Visuais**: Acompanhe leads e negociações através de um quadro Kanban.
*   **Gestão de Clientes**: Armazene contatos, empresas e contratos.
*   **Analytics**: Monitore a Receita Recorrente Mensal (MRR) e funis de vendas.

O sistema é construído com uma **Arquitetura Multi-tenant**, permitindo que múltiplas agências usem a mesma plataforma com isolamento total de dados.

---

## ✨ Principais Funcionalidades

### 1. Inbox Unificado 📨
*   **Layout de 3 Painéis**: Lista de Conversas, Tópico de Mensagens e Painel de Contexto.
*   **Mensagens Estilo Documento**: Interface limpa e profissional focada na clareza.
*   **Contexto do Cliente**: Visualize detalhes do cliente ao lado do chat.

### 2. Funil Visual (Kanban) 📊
*   **Arrastar e Soltar**: Mova negociações facilmente entre as etapas (ex: Lead -> Proposta -> Fechado).
*   **Etapas Personalizadas**: Funis configuráveis para diferentes fluxos de trabalho (Novos Negócios, Renovações).
*   **Cartões de Negociação**: Cartões minimalistas mostrando valor, título e tags.

### 3. Entidades CRM 📇
*   **Leads**: Capture e qualifique clientes em potencial.
*   **Contatos e Empresas**: Gerencie sua agenda com perfis detalhados.
*   **Contratos**: Acompanhe contratos ativos e MRR.

### 4. Dashboard de Analytics 📈
*   **Visão Geral de MRR**: Acompanhe o crescimento da receita ao longo do tempo.
*   **Análise de Funil**: Visualize taxas de conversão através das etapas do funil.

### 5. Segurança e Arquitetura 🔒
*   **RBAC**: Controle de Acesso Baseado em Função (Admin, Vendas, Suporte).
*   **Autenticação Segura**: Autenticação JWT personalizada com cookies HTTP-only.
*   **Isolamento de Dados**: Separação estrita de inquilinos no nível do banco de dados.

---

## 🛠 Stack Tecnológica

**Frontend:**
*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
*   **Estilização**: CSS Modules + CSS Variables (Zero runtime overhead)
*   **Ícones**: [Lucide React](https://lucide.dev/)
*   **Drag & Drop**: `@dnd-kit`

**Backend:**
*   **Banco de Dados**: SQLite (Dev) / PostgreSQL (Pronto para Prod)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Auth**: `jose` (JWT), `bcryptjs` (Hashing)

---

## 🏁 Começando

### Pré-requisitos
*   **Node.js**: v18 ou superior
*   **npm**: v9 ou superior

### Instalação

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/seu-repo/crm-alma.git
    cd crm-alma
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Configure o Ambiente**:
    O projeto vem com um arquivo `.env` pré-configurado para desenvolvimento local.
    ```env
    DATABASE_URL="file:./dev.db"
    JWT_SECRET="sua-chave-super-secreta-mude-em-prod"
    ```

### Configuração do Banco de Dados

1.  **Inicialize o Banco de Dados**:
    Este comando cria o arquivo SQLite e aplica o esquema.
    ```bash
    npx prisma migrate dev --name init
    ```

2.  **Popule com Dados Iniciais (Seed)**:
    Popule o banco de dados com o inquilino padrão ("Alma") e usuários.
    ```bash
    npx tsx prisma/seed.ts
    ```

3.  **Execute o Servidor**:
    ```bash
    npm run dev
    ```
    Acesse o app em [http://localhost:3000](http://localhost:3000).

---

## 🎮 Guia de Uso

### Credenciais de Login
O script de seed cria as seguintes contas padrão para o inquilino **Alma**:

| Função | Email | Senha |
| :--- | :--- | :--- |
| **Admin** | `admin@alma.agency` | `123456` |
| **Vendas** | `vendas@alma.agency` | `123456` |

### Módulos Principais

*   **Inbox**: Clique no ícone "Inbox" na barra lateral. Selecione uma conversa para ver as mensagens.
*   **Funil**: Clique no ícone "Trello". Arraste os cartões para atualizar sua etapa.
*   **Contatos/Empresas**: Use os ícones "Usuários" e "Prédio" para gerenciar entidades.
*   **Sair**: Clique no ícone "Log Out" na parte inferior da barra lateral.

---

## 📂 Estrutura do Projeto

```
src/
├── app/                 # Páginas e rotas de API do Next.js App Router
│   ├── api/             # Endpoints da API Backend (auth, leads, pipeline...)
│   ├── (routes)/        # Rotas de UI (inbox, pipeline, etc.)
│   ├── globals.css      # Estilos globais e variáveis
│   └── layout.tsx       # Layout raiz com Sidebar e Providers
├── components/          # Componentes React
│   ├── inbox/           # Componentes específicos do Inbox
│   ├── pipeline/        # Componentes do quadro Kanban
│   ├── layout/          # Sidebar e estrutura
│   └── providers/       # Provedores de Contexto (Branding)
├── lib/                 # Utilitários (Cliente Prisma, Auxiliares de Auth)
└── services/            # Camada de lógica de negócios
prisma/
├── schema.prisma        # Definição do esquema do banco de dados
└── seed.ts              # Script de população de dados
```

---

## 🎨 Design System

O projeto utiliza um **Design System Profissional** focado em clareza e confiança.

*   **Cor Primária**: Azul Royal (`#2563EB`)
*   **Fundos**: Cinza Slate (`#F8FAFC`, `#FFFFFF`)
*   **Tipografia**: `Geist Sans` (Moderna, geométrica, legível)
*   **Modo**: Apenas Modo Claro (Forçado para consistência)

---

## 📄 Licença

Este software é proprietário e desenvolvido para **Alma Agência Digital**.

# CRM Alma

A modern, comprehensive Customer Relationship Management (CRM) system built with Next.js 16, designed to streamline sales processes, manage client relationships, and provide actionable analytics.

## 🚀 Features

### Core CRM
-   **Multi-Tenancy Support**: Built from the ground up to support multiple organizations (Tenants) with data isolation.
-   **Company & Contact Management**: Centralized database for all your business relationships.
-   **Sales Pipeline**: Visual Kanban-style pipeline to manage Leads and Deals through various stages.
-   **Activity Tracking**: Log calls, meetings, and tasks associated with leads and deals.

### Communication & Inbox
-   **Unified Inbox**: Manage conversations from multiple channels in one place.
-   **Message History**: Full history of interactions linked to contacts and deals.

### Finance & Post-Sales
-   **Client Accounts**: Manage active client subscriptions and health scores.
-   **Contract Management**: Track contract terms, renewals, and dates.
-   **MRR Tracking**: Monitor Monthly Recurring Revenue (MRR) and financial growth.

### Analytics & Dashboard
-   **Real-time Dashboard**: Overview of key performance indicators (KPIs).
-   **Visual Charts**: Interactive charts powered by Recharts for data visualization.

### Security & Tech
-   **Secure Authentication**: Custom JWT-based authentication system with secure password hashing.
-   **Role-Based Access**: Support for different user roles (e.g., Sales Rep, Admin).
-   **Modern Stack**: Built on the latest Next.js 16 App Router and React 19.

## 🛠 Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [SQLite](https://www.sqlite.org/) (Development) via [Prisma ORM](https://www.prisma.io/)
-   **Styling**: CSS Modules with Native CSS Variables for theming
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **Drag & Drop**: [dnd-kit](https://dndkit.com/)
-   **Authentication**: `jose` (JWT) & `bcryptjs`

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   npm, yarn, pnpm, or bun

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd CRM_Alma
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory (copy from `.env.example` if available) and configure your database URL and JWT secret.
    ```env
    DATABASE_URL="file:./dev.db"
    JWT_SECRET="your-super-secret-key"
    ```

4.  **Database Setup**
    Push the Prisma schema to your database:
    ```bash
    npx prisma db push
    ```

5.  **Run the Development Server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
src/
├── app/                # Next.js App Router pages and layouts
│   ├── api/            # Backend API routes
│   ├── (auth)/         # Authentication routes (login, etc.)
│   ├── dashboard/      # Main dashboard views
│   └── ...
├── components/         # Reusable UI components
├── lib/                # Utility functions and shared logic
├── services/           # Business logic and data access layer
└── middleware.ts       # Edge middleware for auth protection
prisma/
└── schema.prisma       # Database schema definition
```

## 📜 Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Runs the built production application.
-   `npm run lint`: Runs ESLint to check for code quality issues.

## 📄 License

This project is proprietary and confidential. Unauthorized copying of this file, via any medium is strictly prohibited.

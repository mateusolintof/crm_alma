import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCachedTenantByDomain } from "@/services/tenant.service";
import BrandingProvider from "@/components/providers/BrandingProvider";
import Sidebar from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alma CRM",
  description: "CRM Comercial para Agências de Marketing",
};

// Evita pré-renderizar em build e forçar chamadas a banco quando não há conexão.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch default tenant (Alma)
  const tenant = await getCachedTenantByDomain("alma.agency");

  if (!tenant) {
    return (
      <html lang="pt-BR">
        <body>
          <div>Tenant not found. Please run seed.</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <BrandingProvider branding={tenant}>
          <div style={{ display: 'flex', minHeight: '100vh', background: "var(--bg-app)" }}>
            <Sidebar />
            <main style={{ flex: 1, overflow: 'auto' }}>
              {children}
            </main>
          </div>
        </BrandingProvider>
      </body>
    </html>
  );
}

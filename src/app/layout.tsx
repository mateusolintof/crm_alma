import type { Metadata } from "next";
import { Space_Grotesk, Inter_Tight, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCachedTenantByDomain } from "@/services/tenant.service";
import BrandingProvider from "@/components/providers/BrandingProvider";
import Sidebar from "@/components/layout/Sidebar";

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alma CRM",
  description: "CRM Comercial para Agências de Marketing",
};

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
      <body className={`${headingFont.variable} ${bodyFont.variable} ${geistMono.variable}`}>
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

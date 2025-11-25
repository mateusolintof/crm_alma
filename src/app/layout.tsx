import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCachedTenantByDomain } from "@/services/tenant.service";
import { BrandingProvider, QueryProvider } from "@/components/providers";

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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="flex items-center justify-center min-h-screen bg-bg-app">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h1 className="text-xl font-semibold text-text-primary mb-2">
                Tenant não encontrado
              </h1>
              <p className="text-text-secondary">
                Execute o comando seed para configurar o banco de dados.
              </p>
              <code className="mt-4 block px-4 py-2 bg-slate-100 rounded-lg text-sm">
                npx prisma db seed
              </code>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <BrandingProvider branding={tenant}>
            {children}
          </BrandingProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

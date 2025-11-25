import Sidebar from "@/components/layout/Sidebar";
import { CommandPalette, ToastContainer } from "@/components/ui";

/**
 * Layout para páginas autenticadas (dashboard)
 * Inclui Sidebar, ToastContainer e CommandPalette
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg-app">
      {/* Skip link para acessibilidade */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Pular para conteúdo principal
      </a>
      
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main id="main-content" className="flex-1 overflow-auto" role="main">
        {children}
      </main>
      
      {/* Sistema de Toast Notifications */}
      <ToastContainer />
      
      {/* Command Palette (Cmd+K) */}
      <CommandPalette />
    </div>
  );
}


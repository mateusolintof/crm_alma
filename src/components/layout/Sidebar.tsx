'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inbox, Trello, Users, Building2, Settings, LogOut } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Inbox', href: '/inbox', icon: Inbox },
    { label: 'Pipeline', href: '/pipeline', icon: Trello },
    { label: 'Leads', href: '/leads', icon: Users },
    { label: 'Contatos', href: '/contacts', icon: Users },
    { label: 'Empresas', href: '/companies', icon: Building2 },
    { label: 'Config', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    return (
        <div className="w-60 h-screen bg-white border-r border-bg-border flex flex-col p-6 transition-all duration-200 z-50 md:flex hidden">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8 px-3">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold text-lg">
                    A
                </div>
                <span className="text-lg font-semibold text-text-primary tracking-tight">Alma CRM</span>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 flex-1">
                {NAV_ITEMS.map(item => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm
                                transition-all duration-150
                                ${isActive
                                    ? 'bg-primary-subtle text-primary border border-primary-border'
                                    : 'text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary'
                                }
                            `}
                        >
                            <Icon size={20} />
                            <span className="whitespace-nowrap">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-bg-border flex flex-col gap-1">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm text-danger hover:bg-danger-bg transition-all duration-150 w-full"
                >
                    <LogOut size={20} />
                    <span className="whitespace-nowrap">Sair</span>
                </button>
            </div>

            {/* Mobile Bottom Navigation (Hidden on Desktop) */}
        </div>
    );
}

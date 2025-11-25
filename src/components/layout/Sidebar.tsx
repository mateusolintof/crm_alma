'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Inbox,
    LayoutGrid,
    Users,
    Building2,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    UserCircle,
    Target,
    Command,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useUIStore, useToast } from '@/stores';
import { Tooltip } from '@/components/ui';

// Itens de navegação
const NAV_ITEMS = [
    { label: 'Inbox', href: '/inbox', icon: Inbox, shortcut: ['⌘', '1'] },
    { label: 'Pipeline', href: '/pipeline', icon: LayoutGrid, shortcut: ['⌘', '2'] },
    { label: 'Leads', href: '/leads', icon: Target, shortcut: ['⌘', '3'] },
    { label: 'Contatos', href: '/contacts', icon: Users, shortcut: ['⌘', '4'] },
    { label: 'Empresas', href: '/companies', icon: Building2, shortcut: ['⌘', '5'] },
];

const SECONDARY_ITEMS = [
    { label: 'Configurações', href: '/settings/pipelines', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { sidebarCollapsed, toggleSidebar, setCommandPaletteOpen } = useUIStore();
    const toast = useToast();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            toast.error('Erro ao sair', 'Tente novamente');
        }
    };

    const handleCommandPalette = () => {
        setCommandPaletteOpen(true);
    };

    return (
        <aside
            className={clsx(
                'h-screen bg-white border-r border-bg-border flex flex-col',
                'transition-all duration-300 ease-in-out z-50',
                sidebarCollapsed ? 'w-[72px]' : 'w-60'
            )}
        >
            {/* Header / Logo */}
            <div
                className={clsx(
                    'flex items-center h-16 border-b border-bg-border',
                    sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'
                )}
            >
                {sidebarCollapsed ? (
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        A
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
                                A
                            </div>
                            <span className="text-lg font-semibold text-text-primary tracking-tight">
                                Alma CRM
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Command Palette Trigger */}
            {!sidebarCollapsed && (
                <div className="px-3 py-3">
                    <button
                        onClick={handleCommandPalette}
                        className={clsx(
                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                            'bg-bg-hover text-text-secondary text-sm',
                            'hover:bg-bg-border transition-colors',
                            'border border-transparent hover:border-bg-border'
                        )}
                    >
                        <Command size={16} />
                        <span className="flex-1 text-left">Buscar...</span>
                        <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-text-tertiary">
                            <span className="px-1 py-0.5 bg-white border border-bg-border rounded">⌘</span>
                            <span className="px-1 py-0.5 bg-white border border-bg-border rounded">K</span>
                        </kbd>
                    </button>
                </div>
            )}

            {sidebarCollapsed && (
                <div className="px-2 py-3 flex justify-center">
                    <Tooltip content="Buscar (⌘K)" side="right">
                        <button
                            onClick={handleCommandPalette}
                            className={clsx(
                                'w-10 h-10 flex items-center justify-center rounded-lg',
                                'bg-bg-hover text-text-secondary',
                                'hover:bg-bg-border transition-colors'
                            )}
                        >
                            <Command size={18} />
                        </button>
                    </Tooltip>
                </div>
            )}

            {/* Navigation Principal */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                {/* Label da seção */}
                {!sidebarCollapsed && (
                    <span className="block px-3 py-2 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
                        Menu
                    </span>
                )}

                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;

                    const linkContent = (
                        <Link
                            href={item.href}
                            className={clsx(
                                'flex items-center gap-3 rounded-lg font-medium transition-all duration-150',
                                sidebarCollapsed
                                    ? 'w-10 h-10 justify-center'
                                    : 'px-3 py-2.5',
                                isActive
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                            )}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                            {!sidebarCollapsed && (
                                <>
                                    <span className="flex-1 text-sm">{item.label}</span>
                                    {item.shortcut && (
                                        <kbd className="hidden lg:flex items-center gap-0.5 text-[10px] opacity-60">
                                            {item.shortcut.map((key, i) => (
                                                <span
                                                    key={i}
                                                    className={clsx(
                                                        'px-1 py-0.5 rounded',
                                                        isActive ? 'bg-white/20' : 'bg-bg-hover'
                                                    )}
                                                >
                                                    {key}
                                                </span>
                                            ))}
                                        </kbd>
                                    )}
                                </>
                            )}
                        </Link>
                    );

                    if (sidebarCollapsed) {
                        return (
                            <Tooltip key={item.href} content={item.label} side="right">
                                {linkContent}
                            </Tooltip>
                        );
                    }

                    return <div key={item.href}>{linkContent}</div>;
                })}

                {/* Separator */}
                <div className="!my-4 border-t border-bg-border" />

                {/* Secondary Items */}
                {!sidebarCollapsed && (
                    <span className="block px-3 py-2 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
                        Sistema
                    </span>
                )}

                {SECONDARY_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    const linkContent = (
                        <Link
                            href={item.href}
                            className={clsx(
                                'flex items-center gap-3 rounded-lg font-medium transition-all duration-150',
                                sidebarCollapsed
                                    ? 'w-10 h-10 justify-center'
                                    : 'px-3 py-2.5',
                                isActive
                                    ? 'bg-bg-hover text-text-primary'
                                    : 'text-text-tertiary hover:bg-bg-hover hover:text-text-secondary'
                            )}
                        >
                            <Icon size={20} strokeWidth={1.5} />
                            {!sidebarCollapsed && (
                                <span className="text-sm">{item.label}</span>
                            )}
                        </Link>
                    );

                    if (sidebarCollapsed) {
                        return (
                            <Tooltip key={item.href} content={item.label} side="right">
                                {linkContent}
                            </Tooltip>
                        );
                    }

                    return <div key={item.href}>{linkContent}</div>;
                })}
            </nav>

            {/* Footer */}
            <div className={clsx('border-t border-bg-border', sidebarCollapsed ? 'p-2' : 'p-3')}>
                {/* User Info (quando expandido) */}
                {!sidebarCollapsed && (
                    <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-bg-hover">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <UserCircle size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">
                                Administrador
                            </p>
                            <p className="text-xs text-text-tertiary truncate">
                                admin@alma.agency
                            </p>
                        </div>
                    </div>
                )}

                {/* Logout Button */}
                {sidebarCollapsed ? (
                    <Tooltip content="Sair" side="right">
                        <button
                            onClick={handleLogout}
                            className={clsx(
                                'w-10 h-10 flex items-center justify-center rounded-lg',
                                'text-danger hover:bg-danger-bg transition-colors'
                            )}
                        >
                            <LogOut size={20} />
                        </button>
                    </Tooltip>
                ) : (
                    <button
                        onClick={handleLogout}
                        className={clsx(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                            'text-danger hover:bg-danger-bg transition-colors font-medium text-sm'
                        )}
                    >
                        <LogOut size={20} />
                        <span>Sair</span>
                    </button>
                )}

                {/* Collapse Toggle */}
                <div className="mt-2 pt-2 border-t border-bg-border">
                    {sidebarCollapsed ? (
                        <Tooltip content="Expandir menu" side="right">
                            <button
                                onClick={toggleSidebar}
                                className={clsx(
                                    'w-10 h-10 flex items-center justify-center rounded-lg',
                                    'text-text-tertiary hover:bg-bg-hover hover:text-text-secondary transition-colors'
                                )}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </Tooltip>
                    ) : (
                        <button
                            onClick={toggleSidebar}
                            className={clsx(
                                'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                                'text-text-tertiary hover:bg-bg-hover hover:text-text-secondary transition-colors text-sm'
                            )}
                        >
                            <ChevronLeft size={18} />
                            <span>Recolher menu</span>
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}

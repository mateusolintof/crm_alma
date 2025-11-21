'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inbox, Trello, Users, Building2, BarChart3, Settings, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';
import clsx from 'clsx';

const NAV_ITEMS = [
    { label: 'Inbox', href: '/inbox', icon: Inbox },
    { label: 'Pipeline', href: '/pipeline', icon: Trello },
    { label: 'Leads', href: '/leads', icon: Users },
    { label: 'Contatos', href: '/contacts', icon: Users },
    { label: 'Empresas', href: '/companies', icon: Building2 },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Config', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>A</div>
                <span className={styles.logoText}>Alma CRM</span>
            </div>
            <nav className={styles.nav}>
                {NAV_ITEMS.map(item => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(styles.navItem, isActive && styles.active)}
                        >
                            <item.icon size={20} />
                            <span className={styles.label}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <button
                    onClick={handleLogout}
                    className={styles.navItem}
                    style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger)' }}
                >
                    <LogOut size={20} />
                    <span className={styles.label}>Sair</span>
                </button>
            </div>
        </div>
    );
}

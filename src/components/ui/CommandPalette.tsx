'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Inbox,
    LayoutGrid,
    Users,
    Building2,
    Target,
    Settings,
    Plus,
    ArrowRight,
    Hash,
    Command,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useUIStore } from '@/stores';
import { KeyboardShortcut } from './Tooltip';

// Tipos
interface CommandItem {
    id: string;
    title: string;
    description?: string;
    icon: React.ReactNode;
    shortcut?: string[];
    action: () => void;
    category: 'navigation' | 'action' | 'search';
    keywords?: string[];
}

interface CommandGroup {
    title: string;
    items: CommandItem[];
}

export function CommandPalette() {
    const router = useRouter();
    const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Comandos disponíveis
    const commands = useMemo<CommandItem[]>(
        () => [
            // Navegação
            {
                id: 'nav-inbox',
                title: 'Ir para Inbox',
                description: 'Acessar conversas e mensagens',
                icon: <Inbox size={18} />,
                shortcut: ['⌘', '1'],
                action: () => router.push('/inbox'),
                category: 'navigation',
                keywords: ['inbox', 'conversas', 'mensagens', 'chat'],
            },
            {
                id: 'nav-pipeline',
                title: 'Ir para Pipeline',
                description: 'Visualizar funil de vendas',
                icon: <LayoutGrid size={18} />,
                shortcut: ['⌘', '2'],
                action: () => router.push('/pipeline'),
                category: 'navigation',
                keywords: ['pipeline', 'funil', 'vendas', 'deals', 'negócios'],
            },
            {
                id: 'nav-leads',
                title: 'Ir para Leads',
                description: 'Gerenciar leads e prospects',
                icon: <Target size={18} />,
                shortcut: ['⌘', '3'],
                action: () => router.push('/leads'),
                category: 'navigation',
                keywords: ['leads', 'prospects', 'oportunidades'],
            },
            {
                id: 'nav-contacts',
                title: 'Ir para Contatos',
                description: 'Lista de contatos',
                icon: <Users size={18} />,
                shortcut: ['⌘', '4'],
                action: () => router.push('/contacts'),
                category: 'navigation',
                keywords: ['contatos', 'pessoas', 'clientes'],
            },
            {
                id: 'nav-companies',
                title: 'Ir para Empresas',
                description: 'Lista de empresas',
                icon: <Building2 size={18} />,
                shortcut: ['⌘', '5'],
                action: () => router.push('/companies'),
                category: 'navigation',
                keywords: ['empresas', 'companies', 'organizações'],
            },
            {
                id: 'nav-settings',
                title: 'Ir para Configurações',
                description: 'Configurações do sistema',
                icon: <Settings size={18} />,
                action: () => router.push('/settings/pipelines'),
                category: 'navigation',
                keywords: ['configurações', 'settings', 'opções'],
            },
            // Ações
            {
                id: 'action-new-contact',
                title: 'Criar novo contato',
                description: 'Adicionar um novo contato',
                icon: <Plus size={18} />,
                action: () => {
                    router.push('/contacts');
                    // TODO: Abrir modal de criação
                },
                category: 'action',
                keywords: ['novo', 'criar', 'adicionar', 'contato'],
            },
            {
                id: 'action-new-lead',
                title: 'Criar novo lead',
                description: 'Adicionar um novo lead',
                icon: <Plus size={18} />,
                action: () => {
                    router.push('/leads');
                    // TODO: Abrir modal de criação
                },
                category: 'action',
                keywords: ['novo', 'criar', 'adicionar', 'lead'],
            },
            {
                id: 'action-new-deal',
                title: 'Criar novo negócio',
                description: 'Adicionar um novo negócio ao pipeline',
                icon: <Plus size={18} />,
                action: () => {
                    router.push('/pipeline');
                    // TODO: Abrir modal de criação
                },
                category: 'action',
                keywords: ['novo', 'criar', 'adicionar', 'negócio', 'deal'],
            },
        ],
        [router]
    );

    // Filtrar comandos baseado na busca
    const filteredCommands = useMemo(() => {
        if (!search.trim()) return commands;

        const query = search.toLowerCase();
        return commands.filter((cmd) => {
            const titleMatch = cmd.title.toLowerCase().includes(query);
            const descMatch = cmd.description?.toLowerCase().includes(query);
            const keywordsMatch = cmd.keywords?.some((k) => k.includes(query));
            return titleMatch || descMatch || keywordsMatch;
        });
    }, [commands, search]);

    // Agrupar comandos por categoria
    const groupedCommands = useMemo<CommandGroup[]>(() => {
        const groups: CommandGroup[] = [];

        const navigation = filteredCommands.filter((c) => c.category === 'navigation');
        const actions = filteredCommands.filter((c) => c.category === 'action');

        if (navigation.length > 0) {
            groups.push({ title: 'Navegação', items: navigation });
        }
        if (actions.length > 0) {
            groups.push({ title: 'Ações', items: actions });
        }

        return groups;
    }, [filteredCommands]);

    // Total de itens para navegação
    const totalItems = filteredCommands.length;

    // Resetar seleção quando a busca muda
    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    // Focar no input quando abrir
    useEffect(() => {
        if (commandPaletteOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setSearch('');
            setSelectedIndex(0);
        }
    }, [commandPaletteOpen]);

    // Atalho de teclado global (Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(!commandPaletteOpen);
            }

            // Atalhos numéricos
            if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '5') {
                e.preventDefault();
                const index = parseInt(e.key) - 1;
                const navCommands = commands.filter((c) => c.category === 'navigation');
                if (navCommands[index]) {
                    navCommands[index].action();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [commandPaletteOpen, setCommandPaletteOpen, commands]);

    // Navegação por teclado dentro do palette
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev + 1) % totalItems);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filteredCommands[selectedIndex]) {
                        filteredCommands[selectedIndex].action();
                        setCommandPaletteOpen(false);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    setCommandPaletteOpen(false);
                    break;
            }
        },
        [filteredCommands, selectedIndex, totalItems, setCommandPaletteOpen]
    );

    // Executar comando
    const executeCommand = useCallback(
        (cmd: CommandItem) => {
            cmd.action();
            setCommandPaletteOpen(false);
        },
        [setCommandPaletteOpen]
    );

    if (!commandPaletteOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 animate-fade-in"
                onClick={() => setCommandPaletteOpen(false)}
            />

            {/* Palette */}
            <div
                className={clsx(
                    'relative w-full max-w-xl bg-white rounded-xl shadow-2xl',
                    'border border-bg-border overflow-hidden animate-scale-in'
                )}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-bg-border">
                    <Search size={20} className="text-text-tertiary flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar comandos, páginas..."
                        className={clsx(
                            'flex-1 bg-transparent text-text-primary placeholder:text-text-tertiary',
                            'focus:outline-none text-base'
                        )}
                    />
                    <kbd className="hidden sm:flex items-center gap-1 text-xs text-text-tertiary">
                        <span className="px-1.5 py-0.5 bg-bg-hover border border-bg-border rounded">
                            ESC
                        </span>
                    </kbd>
                </div>

                {/* Results */}
                <div ref={listRef} className="max-h-[400px] overflow-y-auto py-2">
                    {groupedCommands.length === 0 ? (
                        <div className="px-4 py-8 text-center text-text-tertiary">
                            <p className="text-sm">Nenhum comando encontrado</p>
                        </div>
                    ) : (
                        groupedCommands.map((group) => {
                            let groupStartIndex = 0;
                            for (const g of groupedCommands) {
                                if (g === group) break;
                                groupStartIndex += g.items.length;
                            }

                            return (
                                <div key={group.title}>
                                    <div className="px-4 py-2">
                                        <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                                            {group.title}
                                        </span>
                                    </div>
                                    {group.items.map((cmd, itemIndex) => {
                                        const absoluteIndex = groupStartIndex + itemIndex;
                                        const isSelected = selectedIndex === absoluteIndex;

                                        return (
                                            <button
                                                key={cmd.id}
                                                onClick={() => executeCommand(cmd)}
                                                onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                                                className={clsx(
                                                    'w-full flex items-center gap-3 px-4 py-2.5',
                                                    'transition-colors text-left',
                                                    isSelected
                                                        ? 'bg-primary text-white'
                                                        : 'hover:bg-bg-hover'
                                                )}
                                            >
                                                <span
                                                    className={clsx(
                                                        'flex-shrink-0',
                                                        isSelected
                                                            ? 'text-white'
                                                            : 'text-text-tertiary'
                                                    )}
                                                >
                                                    {cmd.icon}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className={clsx(
                                                            'font-medium text-sm',
                                                            isSelected
                                                                ? 'text-white'
                                                                : 'text-text-primary'
                                                        )}
                                                    >
                                                        {cmd.title}
                                                    </p>
                                                    {cmd.description && (
                                                        <p
                                                            className={clsx(
                                                                'text-xs truncate',
                                                                isSelected
                                                                    ? 'text-white/70'
                                                                    : 'text-text-tertiary'
                                                            )}
                                                        >
                                                            {cmd.description}
                                                        </p>
                                                    )}
                                                </div>
                                                {cmd.shortcut && (
                                                    <div className="flex-shrink-0 flex items-center gap-0.5">
                                                        {cmd.shortcut.map((key, i) => (
                                                            <kbd
                                                                key={i}
                                                                className={clsx(
                                                                    'px-1.5 py-0.5 text-2xs rounded',
                                                                    isSelected
                                                                        ? 'bg-white/20 text-white'
                                                                        : 'bg-bg-hover text-text-tertiary border border-bg-border'
                                                                )}
                                                            >
                                                                {key}
                                                            </kbd>
                                                        ))}
                                                    </div>
                                                )}
                                                {isSelected && (
                                                    <ArrowRight
                                                        size={16}
                                                        className="flex-shrink-0 text-white"
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-bg-border bg-bg-app flex items-center justify-between text-xs text-text-tertiary">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1 py-0.5 bg-white border border-bg-border rounded">↑</kbd>
                            <kbd className="px-1 py-0.5 bg-white border border-bg-border rounded">↓</kbd>
                            navegar
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1 py-0.5 bg-white border border-bg-border rounded">↵</kbd>
                            selecionar
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Command size={12} />
                        <span>K para abrir</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommandPalette;

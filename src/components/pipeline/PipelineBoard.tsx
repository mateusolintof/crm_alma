'use client';

import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import { DollarSign, Building2, Plus, ChevronDown, Settings, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { usePipelines, usePipeline, useMoveDeal } from '@/hooks';
import {
    Button,
    Card,
    SkeletonKanban,
    ErrorState,
    EmptyDeals,
    Badge,
    Tooltip,
    SelectDropdown,
} from '@/components/ui';

// Dynamic import do dnd-kit para reduzir bundle inicial
const DndContext = dynamic(
    () => import('@dnd-kit/core').then((mod) => mod.DndContext),
    { ssr: false }
);
const DragOverlay = dynamic(
    () => import('@dnd-kit/core').then((mod) => mod.DragOverlay),
    { ssr: false }
);
const SortableContext = dynamic(
    () => import('@dnd-kit/sortable').then((mod) => mod.SortableContext),
    { ssr: false }
);

// Types
interface DealCardData {
    id: string;
    title: string;
    value: string;
    company: string;
    tags: string[];
}

interface ColumnData {
    id: string;
    title: string;
    deals: DealCardData[];
}

interface PipelineApiDeal {
    id: string;
    title: string;
    expectedMRR: number | null;
    company: { name: string } | null;
}

interface PipelineStage {
    id: string;
    name: string;
    deals: PipelineApiDeal[];
}

// ============================================
// Deal Card Component (Memoizado)
// ============================================

interface DealCardProps {
    deal: DealCardData;
    isDragging?: boolean;
}

const DealCard = memo(function DealCard({ deal, isDragging }: DealCardProps) {
    return (
        <Card
            hoverable={!isDragging}
            className={clsx(
                'cursor-grab active:cursor-grabbing',
                isDragging && 'opacity-90 shadow-lg scale-[1.02]'
            )}
        >
            <h4 className="font-semibold text-text-primary mb-2 line-clamp-2">{deal.title}</h4>
            <div className="flex items-center gap-1.5 text-sm text-text-secondary font-medium mb-3">
                <DollarSign size={16} className="text-success" />
                {deal.value}
            </div>
            <div className="flex items-center justify-between text-xs border-t border-bg-border pt-2.5">
                <div className="flex items-center gap-1.5 text-text-tertiary">
                    <Building2 size={14} />
                    <span className="truncate max-w-[120px]">{deal.company}</span>
                </div>
                {deal.tags.length > 0 && (
                    <div className="flex gap-1">
                        {deal.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="default" size="sm">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
});

// ============================================
// Pipeline Column Component (Memoizado)
// ============================================

interface PipelineColumnProps {
    column: ColumnData;
    onAddDeal?: () => void;
}

const PipelineColumn = memo(function PipelineColumn({ column, onAddDeal }: PipelineColumnProps) {
    const totalValue = useMemo(() => {
        return column.deals.reduce((acc, deal) => {
            const value = parseFloat(deal.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            return acc + value;
        }, 0);
    }, [column.deals]);

    return (
            <div className="min-w-320 w-80 flex flex-col max-h-full bg-bg-app rounded-lg">
            {/* Column Header */}
            <div className="px-3 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-text-primary">{column.title}</h3>
                    <Badge variant="default" size="sm">
                        {column.deals.length}
                    </Badge>
                </div>
                <Tooltip content="Adicionar negócio">
                    <button
                        onClick={onAddDeal}
                        className="p-1 rounded hover:bg-bg-hover transition-colors text-text-tertiary hover:text-text-primary"
                    >
                        <Plus size={16} />
                    </button>
                </Tooltip>
            </div>

            {/* Value Summary */}
            {totalValue > 0 && (
                <div className="px-3 pb-2">
                    <p className="text-xs text-text-tertiary">
                        Total:{' '}
                        <span className="font-medium text-success">
                            R$ {totalValue.toLocaleString('pt-BR')}
                        </span>
                    </p>
                </div>
            )}

            {/* Column Content */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 flex flex-col gap-2">
                {column.deals.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center py-8">
                        <p className="text-xs text-text-tertiary text-center">
                            Arraste negócios para cá
                        </p>
                    </div>
                ) : (
                    column.deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
                )}
            </div>
        </div>
    );
});

// ============================================
// Pipeline Selector Component
// ============================================

interface PipelineSelectorProps {
    pipelines: Array<{ id: string; name: string; type: string }>;
    selectedId: string | null;
    onSelect: (id: string) => void;
}

const PipelineSelector = memo(function PipelineSelector({
    pipelines,
    selectedId,
    onSelect,
}: PipelineSelectorProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [open]);

    const selectedPipeline = pipelines.find((p) => p.id === selectedId);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                    'bg-bg-hover hover:bg-bg-border'
                )}
            >
                <span className="text-lg font-semibold text-text-primary">
                    {selectedPipeline?.name || 'Selecione Pipeline'}
                </span>
                <ChevronDown
                    size={18}
                    className={clsx(
                        'text-text-secondary transition-transform',
                        open && 'rotate-180'
                    )}
                />
            </button>

            {open && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-bg-border rounded-lg shadow-lg min-w-[260px] z-50 animate-scale-in">
                    <div className="py-1">
                        {pipelines.map((pipeline) => (
                            <button
                                key={pipeline.id}
                                onClick={() => {
                                    onSelect(pipeline.id);
                                    setOpen(false);
                                }}
                                className={clsx(
                                    'w-full px-4 py-2.5 text-left hover:bg-bg-hover transition-colors',
                                    'flex items-center justify-between',
                                    selectedId === pipeline.id && 'bg-bg-hover'
                                )}
                            >
                                <div>
                                    <div className="font-medium text-text-primary">
                                        {pipeline.name}
                                    </div>
                                    <div className="text-xs text-text-tertiary">{pipeline.type}</div>
                                </div>
                                {selectedId === pipeline.id && (
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="border-t border-bg-border py-1">
                        <Link
                            href="/settings/pipelines"
                            className={clsx(
                                'w-full px-4 py-2.5 text-left hover:bg-bg-hover transition-colors',
                                'flex items-center gap-2 text-text-secondary'
                            )}
                        >
                            <Settings size={16} />
                            Gerenciar Pipelines
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
});

// ============================================
// Main Pipeline Board Component
// ============================================

export default function PipelineBoard() {
    const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
    const [columns, setColumns] = useState<ColumnData[]>([]);
    const [activeDeal, setActiveDeal] = useState<DealCardData | null>(null);
    const [isDndLoaded, setIsDndLoaded] = useState(false);

    // Fetch pipelines list
    const { data: pipelines = [], isLoading: isLoadingPipelines } = usePipelines();

    // Fetch selected pipeline data
    const {
        data: pipelineData,
        isLoading: isLoadingPipeline,
        error: pipelineError,
        refetch: refetchPipeline,
    } = usePipeline(selectedPipelineId || undefined);

    // Move deal mutation
    const moveDeal = useMoveDeal();

    // Auto-select first pipeline
    useEffect(() => {
        if (pipelines.length > 0) {
            setSelectedPipelineId((prev) => prev ?? pipelines[0].id);
        }
    }, [pipelines]);

    // Map pipeline data to columns
    useEffect(() => {
        if (pipelineData?.stages) {
            const mappedColumns = pipelineData.stages.map((stage) => ({
                id: stage.id,
                title: stage.name,
                deals: (stage.deals || []).map((deal) => ({
                    id: deal.id,
                    title: deal.title,
                    value: deal.expectedMRR
                        ? `R$ ${Number(deal.expectedMRR).toLocaleString('pt-BR')}/mês`
                        : 'R$ 0',
                    company: (deal as PipelineApiDeal).company?.name || 'Sem empresa',
                    tags: [] as string[],
                })),
            }));
            setColumns(mappedColumns);
        }
    }, [pipelineData]);

    // Load dnd-kit dynamically
    useEffect(() => {
        setIsDndLoaded(true);
    }, []);

    // Drag handlers
    const handleDragStart = useCallback((event: any) => {
        const { active } = event;
        const deal = columns.flatMap((c) => c.deals).find((d) => d.id === active.id);
        if (deal) {
            setActiveDeal(deal);
        }
    }, [columns]);

    const handleDragEnd = useCallback(
        async (event: any) => {
            const { active, over } = event;
            setActiveDeal(null);

            if (!over) return;

            const activeId = active.id;
            const overId = over.id;

            // Find source and target columns
            const sourceColumn = columns.find((col) =>
                col.deals.some((d) => d.id === activeId)
            );
            const targetColumn = columns.find(
                (col) => col.id === overId || col.deals.some((d) => d.id === overId)
            );

            if (!sourceColumn || !targetColumn) return;
            if (sourceColumn.id === targetColumn.id) return; // Same column, no move needed

            // Optimistic update
            const deal = sourceColumn.deals.find((d) => d.id === activeId);
            if (!deal) return;

            setColumns((prev) =>
                prev.map((col) => {
                    if (col.id === sourceColumn.id) {
                        return { ...col, deals: col.deals.filter((d) => d.id !== activeId) };
                    }
                    if (col.id === targetColumn.id) {
                        return { ...col, deals: [...col.deals, deal] };
                    }
                    return col;
                })
            );

            // Persist to API
            try {
                await moveDeal.mutateAsync({
                    id: activeId as string,
                    stageId: targetColumn.id,
                });
            } catch (error) {
                // Rollback on error - refetch data
                refetchPipeline();
            }
        },
        [columns, moveDeal, refetchPipeline]
    );

    // Loading states
    if (isLoadingPipelines) {
        return (
            <div className="flex flex-col h-screen bg-bg-app">
                <div className="px-6 h-16 border-b border-bg-border bg-white flex items-center">
                    <div className="h-8 w-48 bg-bg-border rounded animate-pulse" />
                </div>
                <div className="flex-1 p-6">
                    <SkeletonKanban columns={4} cardsPerColumn={3} />
                </div>
            </div>
        );
    }

    if (isLoadingPipeline) {
        return (
            <div className="flex flex-col h-screen bg-bg-app">
                <div className="px-6 h-16 border-b border-bg-border bg-white flex items-center justify-between">
                    <PipelineSelector
                        pipelines={pipelines}
                        selectedId={selectedPipelineId}
                        onSelect={setSelectedPipelineId}
                    />
                </div>
                <div className="flex-1 p-6">
                    <SkeletonKanban columns={4} cardsPerColumn={3} />
                </div>
            </div>
        );
    }

    if (pipelineError) {
        return (
            <div className="flex flex-col h-screen bg-bg-app">
                <div className="px-6 h-16 border-b border-bg-border bg-white flex items-center">
                    <PipelineSelector
                        pipelines={pipelines}
                        selectedId={selectedPipelineId}
                        onSelect={setSelectedPipelineId}
                    />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <ErrorState
                        title="Erro ao carregar pipeline"
                        description="Não foi possível carregar os dados do pipeline."
                        onRetry={() => refetchPipeline()}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-bg-app overflow-hidden">
            {/* Header */}
            <div className="px-6 h-16 border-b border-bg-border bg-white flex items-center justify-between flex-shrink-0">
                <PipelineSelector
                    pipelines={pipelines}
                    selectedId={selectedPipelineId}
                    onSelect={setSelectedPipelineId}
                />
                <Button icon={<Plus size={18} />}>Novo Negócio</Button>
            </div>

            {/* Pipeline Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                {isDndLoaded ? (
                    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <div className="flex gap-4 h-full items-start">
                            {columns.map((col) => (
                                <PipelineColumn key={col.id} column={col} />
                            ))}
                        </div>
                        <DragOverlay>
                            {activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}
                        </DragOverlay>
                    </DndContext>
                ) : (
                    <div className="flex gap-4 h-full items-start">
                        {columns.map((col) => (
                            <PipelineColumn key={col.id} column={col} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

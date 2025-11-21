'use client';

import { useState, useEffect, useRef } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DollarSign, Building2, Plus, ChevronDown, Settings } from 'lucide-react';
import Link from 'next/link';

// Types
type Deal = {
    id: string;
    title: string;
    value: string;
    company: string;
    tags: string[];
};

type Column = {
    id: string;
    title: string;
    deals: Deal[];
};

type PipelineApiDeal = {
    id: string;
    title: string;
    expectedMRR: number | null;
    company: { name: string } | null;
};

type PipelineStage = {
    id: string;
    name: string;
    deals: PipelineApiDeal[];
};

// --- Components ---

function DealCard({ deal, isOverlay }: { deal: Deal; isOverlay?: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: deal.id, data: { type: 'Deal', deal } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
                bg-white border border-bg-border rounded-lg p-4 cursor-grab
                transition-all duration-150
                hover:shadow-md hover:border-primary hover:-translate-y-0.5
                ${(isDragging || isOverlay) ? 'opacity-80 cursor-grabbing shadow-lg scale-105' : ''}
            `}
        >
            <h4 className="font-semibold text-text-primary mb-2">{deal.title}</h4>
            <div className="flex items-center gap-1.5 text-sm text-text-secondary font-medium mb-3">
                <DollarSign size={16} className="text-success" />
                {deal.value}
            </div>
            <div className="flex items-center justify-between text-xs border-t border-bg-border pt-2.5">
                <div className="flex items-center gap-1.5 text-text-tertiary">
                    <Building2 size={14} />
                    <span className="truncate">{deal.company}</span>
                </div>
                {deal.tags.length > 0 && (
                    <div className="flex gap-1">
                        {deal.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-bg-surface-hover text-text-secondary rounded text-xs">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function PipelineColumn({ column }: { column: Column }) {
    const { setNodeRef } = useSortable({
        id: column.id,
        data: { type: 'Column', column },
    });

    return (
        <div ref={setNodeRef} className="min-w-[320px] w-80 flex flex-col max-h-full">
            {/* Column Header */}
            <div className="px-1 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-text-secondary uppercase tracking-wide">
                    {column.title}
                </h3>
                <span className="text-xs text-text-tertiary bg-bg-surface-hover px-2 py-1 rounded-full">
                    {column.deals.length}
                </span>
            </div>

            {/* Column Content */}
            <div className="flex-1 overflow-y-auto py-1 flex flex-col gap-3">
                <SortableContext items={column.deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                    {column.deals.map(deal => (
                        <DealCard key={deal.id} deal={deal} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}

type Pipeline = {
    id: string;
    name: string;
    type: string;
};

export default function PipelineBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
    const [snapshotColumns, setSnapshotColumns] = useState<Column[]>([]);
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
    const [showPipelineDropdown, setShowPipelineDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowPipelineDropdown(false);
            }
        }

        if (showPipelineDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showPipelineDropdown]);

    // Fetch available pipelines
    useEffect(() => {
        async function fetchPipelines() {
            try {
                const res = await fetch('/api/pipelines');
                const data = await res.json();
                setPipelines(data);
                if (data.length > 0 && !selectedPipelineId) {
                    setSelectedPipelineId(data[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch pipelines', error);
            }
        }
        fetchPipelines();
    }, []);

    // Fetch pipeline data when selected pipeline changes
    useEffect(() => {
        if (!selectedPipelineId) return;

        async function fetchPipeline() {
            setLoading(true);
            try {
                const res = await fetch(`/api/pipelines/${selectedPipelineId}`);
                const data = await res.json();

                if (data.stages) {
                    const mappedColumns = data.stages.map((stage: PipelineStage) => ({
                        id: stage.id,
                        title: stage.name,
                        deals: stage.deals.map((deal: PipelineApiDeal) => ({
                            id: deal.id,
                            title: deal.title,
                            value: deal.expectedMRR ? `R$ ${deal.expectedMRR}/mês` : 'R$ 0',
                            company: deal.company?.name || 'Sem empresa',
                            tags: [],
                        })),
                    }));
                    setColumns(mappedColumns);
                }
            } catch (error) {
                console.error('Failed to fetch pipeline', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPipeline();
    }, [selectedPipelineId]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const deal = active.data.current?.deal as Deal;
        if (deal) {
            setSnapshotColumns(columns);
            setActiveDeal(deal);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeColumn = columns.find(col => col.deals.some(d => d.id === activeId));
        const overColumn = columns.find(col => col.id === overId || col.deals.some(d => d.id === overId));

        if (!activeColumn || !overColumn || activeColumn === overColumn) {
            return;
        }

        setColumns(prev => {
            const activeItems = activeColumn.deals;
            const overItems = overColumn.deals;
            const activeIndex = activeItems.findIndex(d => d.id === activeId);
            const overIndex = overItems.findIndex(d => d.id === overId);

            let newIndex;
            if (overId === overColumn.id) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return prev.map(c => {
                if (c.id === activeColumn.id) {
                    return { ...c, deals: c.deals.filter(d => d.id !== activeId) };
                } else if (c.id === overColumn.id) {
                    const newDeals = [...c.deals];
                    const item = activeItems[activeIndex];

                    if (!newDeals.find(d => d.id === item.id)) {
                        if (overIndex === -1) {
                            newDeals.push(item);
                        } else {
                            newDeals.splice(newIndex, 0, item);
                        }
                    }
                    return { ...c, deals: newDeals };
                }
                return c;
            });
        });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDeal(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const overColumn = columns.find(col => col.id === overId || col.deals.some(d => d.id === overId));

        if (overColumn) {
            try {
                await fetch(`/api/deals/${activeId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stageId: overColumn.id }),
                });
                console.log(`Moved deal ${activeId} to stage ${overColumn.title}`);
            } catch (error) {
                console.error('Failed to persist deal move', error);
                setColumns(snapshotColumns);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-6">
                <div className="text-text-secondary">Carregando pipeline...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-bg-app overflow-hidden">
            {/* Header */}
            <div className="px-6 h-16 border-b border-bg-border bg-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Pipeline Selector Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowPipelineDropdown(!showPipelineDropdown)}
                            className="flex items-center gap-2 px-4 py-2 bg-bg-surface-hover hover:bg-bg-border rounded-md transition-colors"
                        >
                            <span className="text-lg font-semibold text-text-primary">
                                {pipelines.find(p => p.id === selectedPipelineId)?.name || 'Selecione Pipeline'}
                            </span>
                            <ChevronDown size={18} className={`text-text-secondary transition-transform ${showPipelineDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {showPipelineDropdown && (
                            <div className="absolute top-full mt-2 left-0 bg-white border border-bg-border rounded-lg shadow-lg min-w-[240px] z-50">
                                <div className="py-1">
                                    {pipelines.map(pipeline => (
                                        <button
                                            key={pipeline.id}
                                            onClick={() => {
                                                setSelectedPipelineId(pipeline.id);
                                                setShowPipelineDropdown(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left hover:bg-bg-surface-hover transition-colors flex items-center justify-between ${
                                                selectedPipelineId === pipeline.id ? 'bg-bg-surface-hover' : ''
                                            }`}
                                        >
                                            <div>
                                                <div className="font-medium text-text-primary">{pipeline.name}</div>
                                                <div className="text-xs text-text-tertiary">{pipeline.type}</div>
                                            </div>
                                            {selectedPipelineId === pipeline.id && (
                                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <div className="border-t border-bg-border py-1">
                                    <Link
                                        href="/settings/pipelines"
                                        className="w-full px-4 py-2.5 text-left hover:bg-bg-surface-hover transition-colors flex items-center gap-2 text-text-secondary"
                                    >
                                        <Settings size={16} />
                                        Gerenciar Pipelines
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition-all duration-150 hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                    <Plus size={18} />
                    Novo Negócio
                </button>
            </div>

            {/* Pipeline Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-5 h-full items-start">
                        {columns.map(col => (
                            <PipelineColumn key={col.id} column={col} />
                        ))}
                    </div>
                    <DragOverlay>
                        {activeDeal ? <DealCard deal={activeDeal} isOverlay /> : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}

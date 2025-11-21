'use client';

import React, { useState, useEffect } from 'react';
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
import styles from './Pipeline.module.css';
import clsx from 'clsx';

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
            className={clsx(styles.card, (isDragging || isOverlay) && styles.cardDragging)}
        >
            <div className={styles.cardTitle}>{deal.title}</div>
            <div className={styles.cardValue}>{deal.value}</div>
            <div className={styles.cardFooter}>
                <span>{deal.company}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {deal.tags.map(tag => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                </div>
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
        <div ref={setNodeRef} className={styles.column}>
            <div className={styles.columnHeader}>
                {column.title}
                <span style={{ fontSize: '0.8rem', color: '#888' }}>{column.deals.length}</span>
            </div>
            <div className={styles.columnContent}>
                <SortableContext items={column.deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                    {column.deals.map(deal => (
                        <DealCard key={deal.id} deal={deal} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}

export default function PipelineBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
    const [snapshotColumns, setSnapshotColumns] = useState<Column[]>([]);

    useEffect(() => {
        async function fetchPipeline() {
            try {
                const res = await fetch('/api/pipeline');
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
                            tags: [], // TODO: Add tags to DB
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
    }, []);

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

        // Find the containers
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
                // We're over the column container itself
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

                    // Check if already exists to prevent duplicates during rapid drag
                    if (!newDeals.find(d => d.id === item.id)) {
                        // If overIndex is -1 (dropped on column), push to end
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

        // Find the column the item was dropped into
        // Note: overId could be the column ID OR an item ID within that column
        const overColumn = columns.find(col => col.id === overId || col.deals.some(d => d.id === overId));

        if (overColumn) {
            // Call API to persist change
            try {
                await fetch(`/api/deals/${activeId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stageId: overColumn.id }),
                });
                console.log(`Moved deal ${activeId} to stage ${overColumn.title}`);
            } catch (error) {
                console.error('Failed to persist deal move', error);
                // Revert to snapshot if persistence fails
                setColumns(snapshotColumns);
            }
        }
    };

    return (
        <div className={styles.boardContainer}>
            <div className={styles.header}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Pipeline: Novos Negócios</h2>
                <button style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)', color: '#0b1220', border: 'none', borderRadius: '12px', fontWeight: 700, boxShadow: '0 10px 20px rgba(20, 184, 166, 0.25)', cursor: 'pointer' }}>
                    + Novo Negócio
                </button>
            </div>

            {loading && (
                <div style={{ padding: '16px' }}>Carregando pipeline...</div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className={styles.board}>
                    {columns.map(col => (
                        <PipelineColumn key={col.id} column={col} />
                    ))}
                </div>
                <DragOverlay>
                    {activeDeal ? <DealCard deal={activeDeal} isOverlay /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

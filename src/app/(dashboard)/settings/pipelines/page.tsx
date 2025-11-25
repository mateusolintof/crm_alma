'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical, X } from 'lucide-react';
import Link from 'next/link';

type Stage = {
    id?: string;
    name: string;
    orderIndex: number;
    defaultProbability: number | null;
    _count?: {
        deals: number;
    };
};

type Pipeline = {
    id: string;
    name: string;
    type: string;
    stages: Stage[];
    _count: {
        deals: number;
    };
};

const PIPELINE_TYPES = [
    { value: 'NEW_BUSINESS', label: 'Novos Negócios' },
    { value: 'UPSELL', label: 'Upsell/Cross-sell' },
    { value: 'RENEWAL', label: 'Renovação' },
    { value: 'CUSTOM', label: 'Personalizado' },
];

const PIPELINE_TEMPLATES = {
    NEW_BUSINESS: [
        { name: 'Lead Qualificado', defaultProbability: 10 },
        { name: 'Reunião Agendada', defaultProbability: 25 },
        { name: 'Proposta Enviada', defaultProbability: 50 },
        { name: 'Negociação', defaultProbability: 75 },
        { name: 'Fechado Ganho', defaultProbability: 100 },
    ],
    UPSELL: [
        { name: 'Identificado', defaultProbability: 20 },
        { name: 'Proposta', defaultProbability: 50 },
        { name: 'Aprovação', defaultProbability: 80 },
        { name: 'Implementação', defaultProbability: 100 },
    ],
    RENEWAL: [
        { name: '90 dias antes', defaultProbability: 30 },
        { name: 'Proposta enviada', defaultProbability: 60 },
        { name: 'Negociação', defaultProbability: 80 },
        { name: 'Renovado', defaultProbability: 100 },
    ],
};

export default function PipelinesSettingsPage() {
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);

    // Form state
    const [formName, setFormName] = useState('');
    const [formType, setFormType] = useState('NEW_BUSINESS');
    const [formStages, setFormStages] = useState<Stage[]>([]);

    useEffect(() => {
        fetchPipelines();
    }, []);

    async function fetchPipelines() {
        try {
            const res = await fetch('/api/pipelines');
            const data = await res.json();
            setPipelines(data);
        } catch (error) {
            console.error('Failed to fetch pipelines:', error);
        } finally {
            setLoading(false);
        }
    }

    function openCreateModal() {
        setEditingPipeline(null);
        setFormName('');
        setFormType('NEW_BUSINESS');
        setFormStages(PIPELINE_TEMPLATES.NEW_BUSINESS.map((s, i) => ({ ...s, orderIndex: i })));
        setShowModal(true);
    }

    function openEditModal(pipeline: Pipeline) {
        setEditingPipeline(pipeline);
        setFormName(pipeline.name);
        setFormType(pipeline.type);
        setFormStages(pipeline.stages);
        setShowModal(true);
    }

    async function handleSubmit() {
        try {
            const body = {
                name: formName,
                type: formType,
                stages: formStages.map((s, i) => ({
                    ...(s.id && { id: s.id }),
                    name: s.name,
                    orderIndex: i,
                    defaultProbability: s.defaultProbability,
                })),
            };

            const url = editingPipeline
                ? `/api/pipelines/${editingPipeline.id}`
                : '/api/pipelines';

            const method = editingPipeline ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error('Failed to save pipeline');

            setShowModal(false);
            fetchPipelines();
        } catch (error) {
            console.error('Error saving pipeline:', error);
            alert('Erro ao salvar pipeline');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Tem certeza que deseja excluir este pipeline?')) return;

        try {
            const res = await fetch(`/api/pipelines/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error);
            }
            fetchPipelines();
        } catch (error: any) {
            alert(error.message || 'Erro ao excluir pipeline');
        }
    }

    function addStage() {
        setFormStages([...formStages, { name: 'Nova Etapa', orderIndex: formStages.length, defaultProbability: 50 }]);
    }

    function removeStage(index: number) {
        setFormStages(formStages.filter((_, i) => i !== index));
    }

    function updateStage(index: number, field: keyof Stage, value: any) {
        const updated = [...formStages];
        updated[index] = { ...updated[index], [field]: value };
        setFormStages(updated);
    }

    if (loading) {
        return <div className="p-6">Carregando...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary">Pipelines</h1>
                    <p className="text-text-tertiary text-sm">Gerencie os funis de vendas da sua empresa</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition-all duration-150"
                >
                    <Plus size={18} />
                    Novo Pipeline
                </button>
            </div>

            {/* Pipelines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pipelines.map(pipeline => (
                    <div
                        key={pipeline.id}
                        className="bg-white border border-bg-border rounded-lg p-5 hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-text-primary mb-1">{pipeline.name}</h3>
                                <span className="inline-block px-2 py-0.5 bg-primary-subtle text-primary text-xs rounded-full">
                                    {PIPELINE_TYPES.find(t => t.value === pipeline.type)?.label}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(pipeline)}
                                    className="p-1.5 hover:bg-bg-surface-hover rounded transition-colors"
                                >
                                    <Edit2 size={16} className="text-text-tertiary" />
                                </button>
                                <button
                                    onClick={() => handleDelete(pipeline.id)}
                                    className="p-1.5 hover:bg-danger-bg rounded transition-colors"
                                >
                                    <Trash2 size={16} className="text-danger" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 mb-3">
                            <div className="text-sm text-text-secondary">
                                <strong>{pipeline.stages.length}</strong> etapas
                            </div>
                            <div className="text-sm text-text-secondary">
                                <strong>{pipeline._count.deals}</strong> negócios ativos
                            </div>
                        </div>

                        <Link
                            href={`/pipeline?pipelineId=${pipeline.id}`}
                            className="text-primary text-sm font-medium hover:underline"
                        >
                            Ver pipeline →
                        </Link>
                    </div>
                ))}

                {pipelines.length === 0 && (
                    <div className="col-span-3 text-center py-12 text-text-tertiary">
                        Nenhum pipeline criado. Clique em &quot;Novo Pipeline&quot; para começar.
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-bg-border flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                {editingPipeline ? 'Editar Pipeline' : 'Novo Pipeline'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-text-tertiary hover:text-text-primary">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Nome do Pipeline
                                </label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    className="w-full px-3 py-2 border border-bg-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Ex: Novos Negócios"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Tipo
                                </label>
                                <select
                                    value={formType}
                                    onChange={(e) => setFormType(e.target.value)}
                                    className="w-full px-3 py-2 border border-bg-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {PIPELINE_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Stages */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-text-secondary">
                                        Etapas ({formStages.length})
                                    </label>
                                    <button
                                        onClick={addStage}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        + Adicionar etapa
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {formStages.map((stage, index) => (
                                        <div key={index} className="flex items-center gap-2 p-3 bg-bg-surface-hover rounded-md">
                                            <GripVertical size={16} className="text-text-tertiary" />
                                            <input
                                                type="text"
                                                value={stage.name}
                                                onChange={(e) => updateStage(index, 'name', e.target.value)}
                                                className="flex-1 px-2 py-1 border border-bg-border rounded text-sm"
                                                placeholder="Nome da etapa"
                                            />
                                            <input
                                                type="number"
                                                value={stage.defaultProbability || ''}
                                                onChange={(e) => updateStage(index, 'defaultProbability', parseInt(e.target.value) || null)}
                                                className="w-16 px-2 py-1 border border-bg-border rounded text-sm"
                                                placeholder="%"
                                                min="0"
                                                max="100"
                                            />
                                            <button
                                                onClick={() => removeStage(index)}
                                                className="p-1 hover:bg-danger-bg rounded"
                                            >
                                                <Trash2 size={16} className="text-danger" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-bg-border flex gap-3 justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-bg-border rounded-md hover:bg-bg-surface-hover transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!formName || formStages.length === 0}
                                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {editingPipeline ? 'Salvar' : 'Criar Pipeline'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

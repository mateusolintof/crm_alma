'use client';

import { memo } from 'react';
import { Building2, Globe, Tag, Users, Calendar, Edit, Trash2 } from 'lucide-react';
import { Sheet, Button, Badge, Card } from '@/components/ui';
import type { Company } from '@/types';

interface CompanyDetailSheetProps {
    company: Company | null;
    open: boolean;
    onClose: () => void;
    onEdit?: (company: Company) => void;
    onDelete?: (company: Company) => void;
}

export const CompanyDetailSheet = memo(function CompanyDetailSheet({
    company,
    open,
    onClose,
    onEdit,
    onDelete,
}: CompanyDetailSheetProps) {
    if (!company) return null;

    // Parse tags
    const tags = company.tags ? company.tags.split(',').filter(Boolean) : [];

    return (
        <Sheet
            open={open}
            onClose={onClose}
            title="Detalhes da Empresa"
            width="md"
            footer={
                <div className="flex gap-2">
                    {onDelete && (
                        <Button
                            variant="danger-ghost"
                            icon={<Trash2 size={16} />}
                            onClick={() => onDelete(company)}
                        >
                            Excluir
                        </Button>
                    )}
                    <div className="flex-1" />
                    {onEdit && (
                        <Button
                            icon={<Edit size={16} />}
                            onClick={() => onEdit(company)}
                        >
                            Editar
                        </Button>
                    )}
                </div>
            }
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Building2 size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary">{company.name}</h2>
                        {company.segment && (
                            <Badge variant="primary" size="md" className="mt-1">
                                {company.segment}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Informações gerais */}
                <Card variant="outlined" padding="sm">
                    <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                        Informações Gerais
                    </h3>
                    <div className="space-y-3">
                        {/* Website */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center">
                                <Globe size={16} className="text-text-tertiary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-text-tertiary">Website</p>
                                {company.website ? (
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-primary hover:underline truncate block"
                                    >
                                        {company.website.replace(/^https?:\/\//, '')}
                                    </a>
                                ) : (
                                    <span className="text-sm text-text-tertiary">Não informado</span>
                                )}
                            </div>
                        </div>

                        {/* Tamanho */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center">
                                <Users size={16} className="text-text-tertiary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-text-tertiary">Tamanho</p>
                                <p className="text-sm text-text-primary">
                                    {company.size || 'Não informado'}
                                </p>
                            </div>
                        </div>

                        {/* Contatos */}
                        {company._count?.contacts !== undefined && (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center">
                                    <Users size={16} className="text-text-tertiary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-text-tertiary">Contatos</p>
                                    <p className="text-sm text-text-primary">
                                        {company._count.contacts} contatos cadastrados
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Tags */}
                {tags.length > 0 && (
                    <Card variant="outlined" padding="sm">
                        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                            Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <Badge key={index} variant="default">
                                    <Tag size={12} className="mr-1" />
                                    {tag.trim()}
                                </Badge>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Ações Rápidas */}
                <Card variant="outlined" padding="sm">
                    <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                        Ações Rápidas
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="secondary" size="sm" className="w-full">
                            Ver Contatos
                        </Button>
                        <Button variant="secondary" size="sm" className="w-full">
                            Ver Negócios
                        </Button>
                        <Button variant="secondary" size="sm" className="w-full">
                            Criar Lead
                        </Button>
                        <Button variant="secondary" size="sm" className="w-full">
                            Criar Deal
                        </Button>
                    </div>
                </Card>
            </div>
        </Sheet>
    );
});

export default CompanyDetailSheet;


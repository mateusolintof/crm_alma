import type { Lead } from '@/types';
import { createEntityHooks } from './createEntityHooks';

export interface CreateLeadData {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  sourceType: string;
}

const {
  keys: leadKeys,
  useList: useLeads,
  useDetail: useLead,
  useCreate: useCreateLead,
  useUpdate: useUpdateLead,
  useDelete: useDeleteLead,
} = createEntityHooks<Lead, CreateLeadData, Partial<Lead> & { id: string }>({
  resource: 'leads',
  basePath: '/api/leads',
  toastMessages: {
    createSuccess: ['Lead criado', 'O lead foi adicionado com sucesso.'],
    createError: ['Erro', 'Não foi possível criar o lead.'],
    updateSuccess: ['Lead atualizado', 'As alterações foram salvas.'],
    updateError: ['Erro', 'Não foi possível atualizar o lead.'],
    deleteSuccess: ['Lead removido', 'O lead foi deletado.'],
    deleteError: ['Erro', 'Não foi possível remover o lead.'],
  },
});

export { leadKeys, useLeads, useLead, useCreateLead, useUpdateLead, useDeleteLead };

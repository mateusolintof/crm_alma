import type { Company } from '@/types';
import { createEntityHooks } from './createEntityHooks';

const {
  keys: companyKeys,
  useList: useCompanies,
  useDetail: useCompany,
  useCreate: useCreateCompany,
  useUpdate: useUpdateCompany,
  useDelete: useDeleteCompany,
} = createEntityHooks<Company>({
  resource: 'companies',
  basePath: '/api/companies',
  toastMessages: {
    createSuccess: ['Empresa criada', 'A empresa foi adicionada com sucesso.'],
    createError: ['Erro', 'Não foi possível criar a empresa.'],
    updateSuccess: ['Empresa atualizada', 'As alterações foram salvas.'],
    updateError: ['Erro', 'Não foi possível atualizar a empresa.'],
    deleteSuccess: ['Empresa removida', 'A empresa foi deletada.'],
    deleteError: ['Erro', 'Não foi possível remover a empresa.'],
  },
});

export { companyKeys, useCompanies, useCompany, useCreateCompany, useUpdateCompany, useDeleteCompany };

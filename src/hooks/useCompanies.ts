import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Company } from '@/types';
import { useToast } from '@/stores';

// Keys para cache
export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...companyKeys.lists(), filters] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
};

// Fetch de empresas
async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch('/api/companies');
  if (!res.ok) throw new Error('Falha ao carregar empresas');
  return res.json();
}

// Fetch de empresa por ID
async function fetchCompany(id: string): Promise<Company> {
  const res = await fetch(`/api/companies/${id}`);
  if (!res.ok) throw new Error('Empresa não encontrada');
  return res.json();
}

// Criar empresa
async function createCompany(data: Partial<Company>): Promise<Company> {
  const res = await fetch('/api/companies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar empresa');
  return res.json();
}

// Atualizar empresa
async function updateCompany({ id, ...data }: Partial<Company> & { id: string }): Promise<Company> {
  const res = await fetch(`/api/companies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao atualizar empresa');
  return res.json();
}

// Deletar empresa
async function deleteCompany(id: string): Promise<void> {
  const res = await fetch(`/api/companies/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Falha ao deletar empresa');
}

// Hook: Lista de empresas
export function useCompanies() {
  return useQuery({
    queryKey: companyKeys.lists(),
    queryFn: fetchCompanies,
  });
}

// Hook: Empresa por ID
export function useCompany(id: string | undefined) {
  return useQuery({
    queryKey: companyKeys.detail(id!),
    queryFn: () => fetchCompany(id!),
    enabled: !!id,
  });
}

// Hook: Criar empresa
export function useCreateCompany() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      toast.success('Empresa criada', 'A empresa foi adicionada com sucesso.');
    },
    onError: () => {
      toast.error('Erro', 'Não foi possível criar a empresa.');
    },
  });
}

// Hook: Atualizar empresa
export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: updateCompany,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.setQueryData(companyKeys.detail(data.id), data);
      toast.success('Empresa atualizada', 'As alterações foram salvas.');
    },
    onError: () => {
      toast.error('Erro', 'Não foi possível atualizar a empresa.');
    },
  });
}

// Hook: Deletar empresa
export function useDeleteCompany() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      toast.success('Empresa removida', 'A empresa foi deletada.');
    },
    onError: () => {
      toast.error('Erro', 'Não foi possível remover a empresa.');
    },
  });
}


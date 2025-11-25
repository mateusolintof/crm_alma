import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Lead, QueryFilters } from '@/types';
import { useToast } from '@/stores';

// Keys para cache
export const leadKeys = {
  all: ['leads'] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
  list: (filters: QueryFilters) => [...leadKeys.lists(), filters] as const,
  details: () => [...leadKeys.all, 'detail'] as const,
  detail: (id: string) => [...leadKeys.details(), id] as const,
};

// Fetch de leads
async function fetchLeads(): Promise<Lead[]> {
  const res = await fetch('/api/leads');
  if (!res.ok) throw new Error('Falha ao carregar leads');
  return res.json();
}

// Fetch de lead por ID
async function fetchLead(id: string): Promise<Lead> {
  const res = await fetch(`/api/leads/${id}`);
  if (!res.ok) throw new Error('Lead não encontrado');
  return res.json();
}

// Criar lead
interface CreateLeadData {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  sourceType: string;
}

async function createLead(data: CreateLeadData): Promise<Lead> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar lead');
  return res.json();
}

// Atualizar lead
async function updateLead({ id, ...data }: Partial<Lead> & { id: string }): Promise<Lead> {
  const res = await fetch(`/api/leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao atualizar lead');
  return res.json();
}

// Deletar lead
async function deleteLead(id: string): Promise<void> {
  const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Falha ao deletar lead');
}

// Hook: Lista de leads
export function useLeads() {
  return useQuery({
    queryKey: leadKeys.lists(),
    queryFn: fetchLeads,
  });
}

// Hook: Lead por ID
export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: leadKeys.detail(id!),
    queryFn: () => fetchLead(id!),
    enabled: !!id,
  });
}

// Hook: Criar lead
export function useCreateLead() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      toast.success('Lead criado', 'O lead foi adicionado com sucesso.');
    },
    onError: () => {
      toast.error('Erro', 'Não foi possível criar o lead.');
    },
  });
}

// Hook: Atualizar lead
export function useUpdateLead() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: updateLead,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.setQueryData(leadKeys.detail(data.id), data);
      toast.success('Lead atualizado', 'As alterações foram salvas.');
    },
    onError: () => {
      toast.error('Erro', 'Não foi possível atualizar o lead.');
    },
  });
}

// Hook: Deletar lead
export function useDeleteLead() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      toast.success('Lead removido', 'O lead foi deletado.');
    },
    onError: () => {
      toast.error('Erro', 'Não foi possível remover o lead.');
    },
  });
}

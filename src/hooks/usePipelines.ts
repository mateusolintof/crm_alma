import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Pipeline, Deal } from '@/types';
import { useToast } from '@/stores';

// Keys para cache
export const pipelineKeys = {
  all: ['pipelines'] as const,
  lists: () => [...pipelineKeys.all, 'list'] as const,
  details: () => [...pipelineKeys.all, 'detail'] as const,
  detail: (id: string) => [...pipelineKeys.details(), id] as const,
};

export const dealKeys = {
  all: ['deals'] as const,
  lists: () => [...dealKeys.all, 'list'] as const,
  detail: (id: string) => [...dealKeys.all, 'detail', id] as const,
};

// --- Pipeline Functions ---

async function fetchPipelines(): Promise<Pipeline[]> {
  const res = await fetch('/api/pipelines');
  if (!res.ok) throw new Error('Falha ao carregar pipelines');
  return res.json();
}

async function fetchPipeline(id: string): Promise<Pipeline> {
  const res = await fetch(`/api/pipelines/${id}`);
  if (!res.ok) throw new Error('Pipeline não encontrado');
  return res.json();
}

interface CreatePipelineData {
  name: string;
  type: string;
  stages: Array<{
    name: string;
    orderIndex: number;
    defaultProbability?: number;
  }>;
}

async function createPipeline(data: CreatePipelineData): Promise<Pipeline> {
  const res = await fetch('/api/pipelines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar pipeline');
  return res.json();
}

async function updatePipeline({ id, ...data }: Partial<Pipeline> & { id: string }): Promise<Pipeline> {
  const res = await fetch(`/api/pipelines/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao atualizar pipeline');
  return res.json();
}

async function deletePipeline(id: string): Promise<void> {
  const res = await fetch(`/api/pipelines/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Falha ao deletar pipeline');
  }
}

// --- Deal Functions ---

interface UpdateDealData {
  id: string;
  stageId?: string;
  title?: string;
  expectedMRR?: number;
  status?: string;
}

async function updateDeal({ id, ...data }: UpdateDealData): Promise<Deal> {
  const res = await fetch(`/api/deals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao atualizar negócio');
  return res.json();
}

// --- Hooks: Pipelines ---

export function usePipelines() {
  return useQuery({
    queryKey: pipelineKeys.lists(),
    queryFn: fetchPipelines,
  });
}

export function usePipeline(id: string | undefined) {
  return useQuery({
    queryKey: pipelineKeys.detail(id!),
    queryFn: () => fetchPipeline(id!),
    enabled: !!id,
  });
}

export function useCreatePipeline() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createPipeline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipelineKeys.lists() });
      toast.success('Pipeline criado', 'O pipeline foi adicionado com sucesso.');
    },
    onError: () => {
      toast.error('Erro', 'Não foi possível criar o pipeline.');
    },
  });
}

export function useUpdatePipeline() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: updatePipeline,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pipelineKeys.lists() });
      queryClient.setQueryData(pipelineKeys.detail(data.id), data);
      toast.success('Pipeline atualizado', 'As alterações foram salvas.');
    },
    onError: () => {
      toast.error('Erro', 'Não foi possível atualizar o pipeline.');
    },
  });
}

export function useDeletePipeline() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deletePipeline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipelineKeys.lists() });
      toast.success('Pipeline removido', 'O pipeline foi deletado.');
    },
    onError: (error: Error) => {
      toast.error('Erro', error.message || 'Não foi possível remover o pipeline.');
    },
  });
}

// --- Hooks: Deals ---

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: updateDeal,
    onSuccess: (_, variables) => {
      // Invalidar o pipeline que contém o deal
      queryClient.invalidateQueries({ queryKey: pipelineKeys.details() });
      
      // Mostrar toast apenas para mudanças significativas (não para drag-and-drop)
      if (variables.title || variables.expectedMRR) {
        toast.success('Negócio atualizado', 'As alterações foram salvas.');
      }
    },
    onError: () => {
      toast.error('Erro', 'Não foi possível atualizar o negócio.');
    },
  });
}

// Hook para mover deal (otimista)
export function useMoveDeal() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: updateDeal,
    // Atualização otimista
    onMutate: async (newData) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: pipelineKeys.details() });
      
      // Snapshot do estado anterior para rollback
      const previousData = queryClient.getQueriesData({ queryKey: pipelineKeys.details() });
      
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback em caso de erro
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error('Erro ao mover', 'O negócio voltou para a posição anterior.');
    },
    onSettled: () => {
      // Revalidar dados após mutação
      queryClient.invalidateQueries({ queryKey: pipelineKeys.details() });
    },
  });
}


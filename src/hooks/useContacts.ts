import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Contact } from '@/types';
import { useToast } from '@/stores';

// Keys para cache
export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...contactKeys.lists(), filters] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
};

// Fetch de contatos
async function fetchContacts(): Promise<Contact[]> {
  const res = await fetch('/api/contacts');
  if (!res.ok) throw new Error('Falha ao carregar contatos');
  return res.json();
}

// Fetch de contato por ID
async function fetchContact(id: string): Promise<Contact> {
  const res = await fetch(`/api/contacts/${id}`);
  if (!res.ok) throw new Error('Contato não encontrado');
  return res.json();
}

// Criar contato
async function createContact(data: Partial<Contact>): Promise<Contact> {
  const res = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar contato');
  return res.json();
}

// Atualizar contato
async function updateContact({ id, ...data }: Partial<Contact> & { id: string }): Promise<Contact> {
  const res = await fetch(`/api/contacts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao atualizar contato');
  return res.json();
}

// Deletar contato
async function deleteContact(id: string): Promise<void> {
  const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Falha ao deletar contato');
}

// Hook: Lista de contatos
export function useContacts() {
  return useQuery({
    queryKey: contactKeys.lists(),
    queryFn: fetchContacts,
  });
}

// Hook: Contato por ID
export function useContact(id: string | undefined) {
  return useQuery({
    queryKey: contactKeys.detail(id!),
    queryFn: () => fetchContact(id!),
    enabled: !!id,
  });
}

// Hook: Criar contato
export function useCreateContact() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      toast.success('Contato criado', 'O contato foi adicionado com sucesso.');
    },
    onError: () => {
      toast.error('Erro', 'Não foi possível criar o contato.');
    },
  });
}

// Hook: Atualizar contato
export function useUpdateContact() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: updateContact,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.setQueryData(contactKeys.detail(data.id), data);
      toast.success('Contato atualizado', 'As alterações foram salvas.');
    },
    onError: () => {
      toast.error('Erro', 'Não foi possível atualizar o contato.');
    },
  });
}

// Hook: Deletar contato
export function useDeleteContact() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      toast.success('Contato removido', 'O contato foi deletado.');
    },
    onError: () => {
      toast.error('Erro', 'Não foi possível remover o contato.');
    },
  });
}


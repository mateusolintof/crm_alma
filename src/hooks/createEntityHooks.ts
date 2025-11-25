import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createEntityKeys } from '@/lib/query-keys';
import { useToast } from '@/stores';

interface ToastMessages {
  createSuccess?: [string, string];
  createError?: [string, string];
  updateSuccess?: [string, string];
  updateError?: [string, string];
  deleteSuccess?: [string, string];
  deleteError?: [string, string];
}

interface CrudOptions<TCreate, TUpdate> {
  resource: string;
  basePath: string;
  toastMessages?: ToastMessages;
  transformCreateData?: (data: TCreate) => unknown;
  transformUpdateData?: (data: TUpdate) => unknown;
}

export function createEntityHooks<TEntity, TCreate = Partial<TEntity>, TUpdate = Partial<TEntity> & { id: string }>(
  options: CrudOptions<TCreate, TUpdate>
) {
  const { resource, basePath, toastMessages, transformCreateData, transformUpdateData } = options;
  const keys = createEntityKeys(resource);

  const fetchList = async (): Promise<TEntity[]> => {
    const res = await fetch(basePath);
    if (!res.ok) throw new Error(`Falha ao carregar ${resource}`);
    return res.json();
  };

  const fetchDetail = async (id: string): Promise<TEntity> => {
    const res = await fetch(`${basePath}/${id}`);
    if (!res.ok) throw new Error(`${resource} não encontrado`);
    return res.json();
  };

  const createEntity = async (data: TCreate): Promise<TEntity> => {
    const res = await fetch(basePath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transformCreateData ? transformCreateData(data) : data),
    });
    if (!res.ok) throw new Error(`Falha ao criar ${resource}`);
    return res.json();
  };

  const updateEntity = async ({ id, ...data }: TUpdate & { id: string }): Promise<TEntity> => {
    const res = await fetch(`${basePath}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transformUpdateData ? transformUpdateData(data as TUpdate) : data),
    });
    if (!res.ok) throw new Error(`Falha ao atualizar ${resource}`);
    return res.json();
  };

  const deleteEntity = async (id: string): Promise<void> => {
    const res = await fetch(`${basePath}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Falha ao deletar ${resource}`);
  };

  const useList = () =>
    useQuery({
      queryKey: keys.lists(),
      queryFn: fetchList,
    });

  const useDetail = (id: string | undefined) =>
    useQuery({
      queryKey: id ? keys.detail(id) : keys.details(),
      queryFn: () => fetchDetail(id!),
      enabled: !!id,
    });

  const useCreate = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
      mutationFn: createEntity,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.lists() });
        if (toastMessages?.createSuccess) {
          toast.success(...toastMessages.createSuccess);
        }
      },
      onError: () => {
        if (toastMessages?.createError) {
          toast.error(...toastMessages.createError);
        }
      },
    });
  };

  const useUpdate = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
      mutationFn: updateEntity,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: keys.lists() });
        queryClient.setQueryData(keys.detail((data as { id: string }).id), data);
        if (toastMessages?.updateSuccess) {
          toast.success(...toastMessages.updateSuccess);
        }
      },
      onError: () => {
        if (toastMessages?.updateError) {
          toast.error(...toastMessages.updateError);
        }
      },
    });
  };

  const useDelete = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
      mutationFn: deleteEntity,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.lists() });
        if (toastMessages?.deleteSuccess) {
          toast.success(...toastMessages.deleteSuccess);
        }
      },
      onError: () => {
        if (toastMessages?.deleteError) {
          toast.error(...toastMessages.deleteError);
        }
      },
    });
  };

  return {
    keys,
    useList,
    useDetail,
    useCreate,
    useUpdate,
    useDelete,
  };
}

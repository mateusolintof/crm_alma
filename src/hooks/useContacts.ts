import type { Contact } from '@/types';
import { createEntityHooks } from './createEntityHooks';

const {
  keys: contactKeys,
  useList: useContacts,
  useDetail: useContact,
  useCreate: useCreateContact,
  useUpdate: useUpdateContact,
  useDelete: useDeleteContact,
} = createEntityHooks<Contact>({
  resource: 'contacts',
  basePath: '/api/contacts',
  toastMessages: {
    createSuccess: ['Contato criado', 'O contato foi adicionado com sucesso.'],
    createError: ['Erro', 'Não foi possível criar o contato.'],
    updateSuccess: ['Contato atualizado', 'As alterações foram salvas.'],
    updateError: ['Erro', 'Não foi possível atualizar o contato.'],
    deleteSuccess: ['Contato removido', 'O contato foi deletado.'],
    deleteError: ['Erro', 'Não foi possível remover o contato.'],
  },
});

export { contactKeys, useContacts, useContact, useCreateContact, useUpdateContact, useDeleteContact };

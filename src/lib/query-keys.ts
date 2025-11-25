type QueryKeyBuilder = {
  all: readonly [string];
  lists: () => readonly [string, 'list'];
  list: (filters?: Record<string, unknown>) => readonly [string, 'list', Record<string, unknown>];
  details: () => readonly [string, 'detail'];
  detail: (id: string) => readonly [string, 'detail', string];
};

export function createEntityKeys(entity: string): QueryKeyBuilder {
  return {
    all: [entity] as const,
    lists: () => [entity, 'list'] as const,
    list: (filters: Record<string, unknown> = {}) => [entity, 'list', filters] as const,
    details: () => [entity, 'detail'] as const,
    detail: (id: string) => [entity, 'detail', id] as const,
  };
}

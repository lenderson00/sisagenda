export const supplierKeys = {
  all: ["suppliers"] as const,
  lists: () => [...supplierKeys.all, "list"] as const,
  list: (organizationId: string) =>
    [...supplierKeys.lists(), organizationId] as const,
  stats: (organizationId: string) =>
    [...supplierKeys.all, "stats", organizationId] as const,
  searchByCnpj: (cnpj: string) =>
    [...supplierKeys.all, "search", cnpj] as const,
};

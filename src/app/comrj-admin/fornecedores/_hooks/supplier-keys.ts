export const supplierKeys = {
  all: ["suppliers"],
  lists: () => [...supplierKeys.all, "list"],
  list: (filters: string) => [...supplierKeys.lists(), { filters }],
  details: () => [...supplierKeys.all, "detail"],
  detail: (id: string) => [...supplierKeys.details(), id],
};

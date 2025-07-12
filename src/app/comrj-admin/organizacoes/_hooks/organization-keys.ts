export const organizationKeys = {
  all: ["organizations"],
  lists: () => [...organizationKeys.all, "list"],
  list: (filters: string) => [...organizationKeys.lists(), { filters }],
  details: () => [...organizationKeys.all, "detail"],
  detail: (id: string) => [...organizationKeys.details(), id],
};

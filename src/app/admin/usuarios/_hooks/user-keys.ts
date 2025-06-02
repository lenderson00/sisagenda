export const userKeys = {
  all: (orgId: string) => ["users", orgId] as const,
  list: (orgId: string) => [...userKeys.all(orgId), "list"] as const,
  details: (orgId: string) => [...userKeys.all(orgId), "detail"] as const,
  detail: (orgId: string, id: string) =>
    [...userKeys.details(orgId), id] as const,
  stats: (orgId: string) => [...userKeys.all(orgId), "stats"] as const,
};

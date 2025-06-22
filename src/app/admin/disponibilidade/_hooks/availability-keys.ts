export const availabilityKeys = {
  all: (orgId: string) => ["availability", orgId] as const,
  list: (orgId: string) => [...availabilityKeys.all(orgId), "list"] as const,
  detail: (orgId: string, id: string) =>
    [...availabilityKeys.all(orgId), "detail", id] as const,
};

export const deliveryTypeKeys = {
  all: (orgId: string) => ["delivery-types", orgId] as const,
  list: (orgId: string) => [...deliveryTypeKeys.all(orgId), "list"] as const,
  detail: (orgId: string, id: string) =>
    [...deliveryTypeKeys.all(orgId), "detail", id] as const,
};

import type { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const adminKeys = {
  all: (orgId: string) => ["admins", orgId] as const,
  list: (orgId: string) => [...adminKeys.all(orgId), "list"] as const,
};

export async function getAdmins(organizationId: string) {
  const response = await fetch(`/api/organizations/${organizationId}/admins`);
  if (!response.ok) {
    throw new Error("Failed to fetch admins");
  }
  return response.json();
}

export function useAdmins(organizationId: string) {
  return useQuery<User[]>({
    queryKey: adminKeys.list(organizationId),
    queryFn: () => getAdmins(organizationId),
  });
}

import type { Organization } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const organizationKeys = {
  all: ["organizations"],
  detail: (id: string) => [...organizationKeys.all, id],
};

async function getOrganization(id: string) {
  const response = await fetch(`/api/organizations/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch organization");
  }
  return response.json();
}

export function useOrganization(id: string) {
  return useQuery<Organization>({
    queryKey: organizationKeys.detail(id),
    queryFn: () => getOrganization(id),
    enabled: !!id,
  });
}

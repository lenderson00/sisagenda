import { useQuery } from "@tanstack/react-query";
import { organizationKeys } from "./organization-keys";
import { Organization } from "@prisma/client";

export function useOrganizations() {
  return useQuery<Organization[]>({
    queryKey: organizationKeys.list("all"),
    queryFn: async () => {
      const response = await fetch(`/api/comimsup-admin/organizations`);
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }
      return response.json();
    },
  });
}

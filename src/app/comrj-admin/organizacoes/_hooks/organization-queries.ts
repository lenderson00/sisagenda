import { useQuery } from "@tanstack/react-query";
import { organizationKeys } from "./organization-keys";
import type { OrganizationWithStats } from "../_components/columns";

export function useOrganizations() {
  return useQuery<OrganizationWithStats[]>({
    queryKey: organizationKeys.list("deposits"),
    queryFn: async () => {
      const response = await fetch("/api/comimsup-admin/organizations");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch organizations");
      }
      return response.json();
    },
  });
}

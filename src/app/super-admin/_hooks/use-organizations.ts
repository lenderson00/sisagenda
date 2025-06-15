import type { Organization } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export async function getOrganizations() {
  const response = await fetch("/api/organizations");
  if (!response.ok) {
    throw new Error("Failed to fetch organizations");
  }
  return response.json();
}

export async function getOrganizationsByRole(
  role: "COMIMSUP" | "DEPOSITO" | "COMRJ",
) {
  const response = await fetch(`/api/organizations?role=${role}`);
  if (!response.ok) {
    throw new Error("Failed to fetch organizations");
  }
  return response.json();
}

type OrganizationResponse = Organization & {
  comimsup: {
    name: string;
  };
};

export function useOrganizations() {
  return useQuery<OrganizationResponse[]>({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });
}

export function useOrganizationsByRole(
  role: "COMIMSUP" | "DEPOSITO" | "COMRJ",
) {
  return useQuery<OrganizationResponse[]>({
    queryKey: ["organizations", role],
    queryFn: () => getOrganizationsByRole(role),
  });
}

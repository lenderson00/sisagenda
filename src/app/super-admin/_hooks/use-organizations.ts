import { Organization } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export async function getOrganizations() {
  const response = await fetch("/api/organizations");
  if (!response.ok) {
    throw new Error("Failed to fetch organizations");
  }
  return response.json();
}

export function useOrganizations() {
  return useQuery<Organization[]>({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });
}

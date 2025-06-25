import { useQuery } from "@tanstack/react-query";
import type { Organization } from "@prisma/client";

export const comimsupKeys = {
  all: ["comimsups"] as const,
  byRole: (role: string) => [...comimsupKeys.all, role] as const,
};

async function getComimsups() {
  const response = await fetch("/api/organizations?role=COMIMSUP");
  if (!response.ok) {
    throw new Error("Failed to fetch COMIMSUPs");
  }
  return response.json();
}

export function useComimsups() {
  return useQuery<Organization[]>({
    queryKey: comimsupKeys.byRole("COMIMSUP"),
    queryFn: getComimsups,
  });
}

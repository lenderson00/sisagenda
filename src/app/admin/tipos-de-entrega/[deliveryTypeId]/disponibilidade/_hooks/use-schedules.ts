import { useQuery } from "@tanstack/react-query";

async function getSchedules() {
  const response = await fetch("/api/schedules");
  if (!response.ok) {
    throw new Error("Failed to fetch schedules");
  }
  return response.json();
}

export const useSchedules = (organizationId?: string) => {
  return useQuery({
    queryKey: ["schedules", organizationId],
    queryFn: () => getSchedules(),
    enabled: !!organizationId,
  });
};

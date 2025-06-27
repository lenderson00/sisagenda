import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const scheduleKeys = {
  all: ["schedule"] as const,
  list: (scheduleId: string) => [...scheduleKeys.all, scheduleId] as const,
};

interface TimeInterval {
  weekDay: number;
  startTime: number;
  endTime: number;
}

export function useSchedule(scheduleId: string) {
  return useQuery({
    queryKey: scheduleKeys.list(scheduleId),
    queryFn: async () => {
      const response = await fetch(`/api/schedules/${scheduleId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch schedule");
      }
      return response.json();
    },
  });
}

export function useUpdateSchedule(scheduleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (intervals: TimeInterval[]) => {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ intervals }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save availability");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.list(scheduleId),
      });
      toast.success("Horários salvos com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating schedule:", error);
      toast.error("Erro ao salvar horários");
    },
  });
}

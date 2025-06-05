import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const availabilityKeys = {
  all: ["availability"] as const,
  list: (deliveryTypeId: string) => [...availabilityKeys.all, deliveryTypeId] as const,
};

interface TimeInterval {
  weekDay: number;
  startTime: number;
  endTime: number;
}

export function useAvailability(deliveryTypeId: string) {
  return useQuery({
    queryKey: availabilityKeys.list(deliveryTypeId),
    queryFn: async () => {
      const response = await fetch(`/api/delivery-types/${deliveryTypeId}/availability`);
      if (!response.ok) {
        throw new Error("Failed to fetch availability");
      }
      return response.json();
    },
  });
}

export function useUpdateAvailability(deliveryTypeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (intervals: TimeInterval[]) => {
      const response = await fetch(`/api/delivery-types/${deliveryTypeId}/availability`, {
        method: "POST",
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
        queryKey: availabilityKeys.list(deliveryTypeId),
      });
      toast.success("Horários salvos com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating availability:", error);
      toast.error("Erro ao salvar horários");
    },
  });
}

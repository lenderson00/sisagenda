import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function updateDeliveryType({
  deliveryTypeId,
  data,
}: {
  deliveryTypeId: string;
  data: { scheduleId: string | null };
}) {
  const response = await fetch(`/api/delivery-types/${deliveryTypeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update delivery type");
  }

  return response.json();
}

export const useUpdateDeliveryType = (deliveryTypeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { scheduleId: string | null }) =>
      updateDeliveryType({ deliveryTypeId, data }),
    onSuccess: () => {
      toast.success("Disponibilidade atualizada com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["delivery-type", deliveryTypeId],
      });
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar a disponibilidade: ${error.message}`);
    },
  });
};

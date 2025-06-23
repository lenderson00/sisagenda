import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdateDurationParams {
  deliveryTypeId: string;
  duration: number;
}

interface DeleteDeliveryTypeParams {
  deliveryTypeId: string;
}

export const useDeliveryTypeMutations = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateDuration = useMutation({
    mutationFn: async ({ deliveryTypeId, duration }: UpdateDurationParams) => {
      const response = await fetch(
        `/api/delivery-types/${deliveryTypeId}/duration`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ duration }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update duration");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-type"] });
      toast.success("Duration updated successfully");
    },
    onError: () => {
      toast.error("Failed to update duration");
    },
  });

  const deleteDeliveryType = useMutation({
    mutationFn: async ({ deliveryTypeId }: DeleteDeliveryTypeParams) => {
      const response = await fetch(`/api/delivery-types/${deliveryTypeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete delivery type");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-types"] });
      toast.success("Delivery type deleted successfully");
      router.push("/tipos-de-entrega");
    },
    onError: () => {
      toast.error("Failed to delete delivery type");
    },
  });

  return {
    updateDuration,
    deleteDeliveryType,
  };
};

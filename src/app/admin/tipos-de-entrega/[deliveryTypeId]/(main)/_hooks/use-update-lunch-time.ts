import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateLunchTimeParams {
  deliveryTypeId: string;
  startTime: number;
  endTime: number;
}

export const useUpdateLunchTime = () => {
  const queryClient = useQueryClient();

  const updateLunchTime = useMutation({
    mutationFn: async ({
      deliveryTypeId,
      startTime,
      endTime,
    }: UpdateLunchTimeParams) => {
      const response = await fetch(
        `/api/delivery-types/${deliveryTypeId}/lunch-time`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ startTime, endTime }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update lunch time");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["delivery-type-config"],
      });
      toast.success("Lunch time updated successfully");
    },
    onError: () => {
      toast.error("Failed to update lunch time");
    },
  });

  return {
    ...updateLunchTime,
  };
};

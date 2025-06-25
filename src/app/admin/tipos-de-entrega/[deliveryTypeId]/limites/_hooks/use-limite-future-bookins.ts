import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLimiteFutureBookings(deliveryTypeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { limitFutureBookings: boolean }) => {
      return fetch(`/api/delivery-types/${deliveryTypeId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["deliveryType", deliveryTypeId],
      });
    },
  });
}

import { useQuery } from "@tanstack/react-query";

interface DeliveryTypeConfig {
  id: string;
  duration: number;
  lunchStartTime: string;
  lunchEndTime: string;
  name: string;
  isActive: boolean;
  updatedAt: string;
}

export function useDeliveryTypeConfig(deliveryTypeId: string) {
  return useQuery({
    queryKey: ["delivery-type-config", deliveryTypeId],
    queryFn: async () => {
      const response = await fetch(`/api/delivery-types/${deliveryTypeId}/config`);
      if (!response.ok) {
        throw new Error("Failed to fetch delivery type configuration");
      }
      return response.json() as Promise<DeliveryTypeConfig>;
    },
  });
}

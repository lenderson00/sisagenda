import { useQuery } from "@tanstack/react-query";

async function getDeliveryType(deliveryTypeId: string) {
  const response = await fetch(`/api/delivery-types/${deliveryTypeId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch delivery type");
  }
  return response.json();
}

export const useDeliveryType = (deliveryTypeId: string) => {
  return useQuery({
    queryKey: ["delivery-type", deliveryTypeId],
    queryFn: () => getDeliveryType(deliveryTypeId),
    enabled: !!deliveryTypeId,
  });
};

"use client";

import { useQuery } from "@tanstack/react-query";
import { deliveryTypeKeys } from "./delivery-type-keys";

export function useDeliveryTypes(orgId: string) {
  return useQuery({
    queryKey: deliveryTypeKeys.list(orgId),
    queryFn: async () => {
      const response = await fetch("/api/delivery-types", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch delivery types");
      }
      return response.json();
    },
  });
}

export function useDeliveryType(orgId: string, id: string) {
  return useQuery({
    queryKey: deliveryTypeKeys.detail(orgId, id),
    queryFn: async () => {
      const response = await fetch(`/api/delivery-types/${id}`);
      if (!response.ok) {
        throw new Error("Delivery type not found");
      }
      return response.json();
    },
    enabled: !!id,
  });
}

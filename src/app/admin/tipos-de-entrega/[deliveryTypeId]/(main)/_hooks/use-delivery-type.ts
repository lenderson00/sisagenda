"use client";

import type { DeliveryType } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";



async function getDeliveryType(id: string): Promise<DeliveryType> {
  const res = await fetch(`/api/delivery-types/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch delivery type");
  }
  return res.json();
}

export function useDeliveryType(id: string) {
  return useQuery({
    queryKey: ["delivery-type", id],
    queryFn: () => getDeliveryType(id),
  });
}

async function updateDeliveryType(
  id: string,
  data: Partial<Omit<DeliveryType, "id" | "slug">>,
): Promise<DeliveryType> {
  const res = await fetch(`/api/delivery-types/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to update delivery type");
  }
  return res.json();
}

export function useUpdateDeliveryType(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Omit<DeliveryType, "id" | "slug">>) =>
      updateDeliveryType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-type", id] });
      toast.success("Tipo de entrega atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao atualizar o tipo de entrega.");
    },
  });
}

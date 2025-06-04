"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deliveryTypeKeys } from "./delivery-type-keys";

type DeliveryTypeData = {
  name: string;
  description?: string;
};

export function useCreateDeliveryType(orgId: string, onDialogClose?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeliveryTypeData) => {
      const response = await fetch("/api/delivery-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, organizationId: orgId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create delivery type");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryTypeKeys.list(orgId) });
      if (onDialogClose) onDialogClose();
      toast.success("Tipo de transporte criado com sucesso");
    },
    onError: (error) => {
      toast.error("Falha ao criar tipo de transporte");
      console.error("Create delivery type error:", error);
    },
  });
}

export function useDeleteDeliveryType(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/delivery-types/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete delivery type");
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryTypeKeys.all(orgId) });
      toast.success("Tipo de transporte excluído com sucesso");
    },
    onError: (error) => {
      toast.error("Falha ao excluir tipo de transporte");
      console.error("Delete delivery type error:", error);
    },
  });
}

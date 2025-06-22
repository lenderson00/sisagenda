"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { availabilityKeys } from "./availability-keys";
import type { Availability } from "@prisma/client";

type AvailabilityData = {
  name: string;
};

export function useCreateAvailability(
  orgId: string,
  onDialogClose?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AvailabilityData) => {
      const response = await fetch("/api/availability", {
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
      queryClient.invalidateQueries({ queryKey: availabilityKeys.list(orgId) });
      if (onDialogClose) onDialogClose();
      toast.success("Disponibilidade criada com sucesso");
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
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all(orgId) });
      toast.success("Disponibilidade excluída com sucesso");
    },
    onError: (error) => {
      toast.error("Falha ao excluir disponibilidade");
      console.error("Delete availability error:", error);
    },
  });
}

type UpdateAvailabilityData = Availability

export function useUpdateAvailability(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<UpdateAvailabilityData>;
    }) => {
      const response = await fetch(`/api/availability/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update delivery type");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: availabilityKeys.list(orgId),
      });
      queryClient.setQueryData(availabilityKeys.detail(orgId, data.id), data);
      toast.success("Disponibilidade atualizada com sucesso");
    },
    onError: (error) => {
      toast.error("Falha ao atualizar disponibilidade");
      console.error("Update availability error:", error);
    },
  });
}

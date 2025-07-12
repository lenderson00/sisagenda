import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supplierKeys } from "./supplier-keys";
import type { Supplier } from "@prisma/client";

// --- Create Supplier ---

async function createSupplier(
  data: Omit<
    Supplier,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
    | "emailVerified"
    | "lastLogin"
    | "password"
    | "mustChangePassword"
    | "whatsappVerified"
    | "failedLoginAttempts"
    | "lockoutUntil"
  >,
) {
  const response = await fetch("/api/suppliers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao criar fornecedor");
  }

  return response.json();
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      toast.success("Sucesso!", {
        description: "Fornecedor criado com sucesso.",
      });
    },
    onError: (error) => {
      toast.error("Erro", {
        description: error.message,
      });
    },
  });
}

// --- Update Supplier ---

async function updateSupplier({
  id,
  ...data
}: Partial<Supplier> & { id: string }) {
  const response = await fetch(`/api/suppliers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao atualizar fornecedor");
  }

  return response.json();
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.details() });
      toast.success("Sucesso!", {
        description: "Fornecedor atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast.error("Erro", {
        description: error.message,
      });
    },
  });
}

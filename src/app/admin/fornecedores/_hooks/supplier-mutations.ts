import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supplierKeys } from "./supplier-keys";

export function useCreateSupplier(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      cnpj: string;
      address?: string;
    }) => {
      const response = await fetch("/api/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          organizationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create supplier");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.list(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: supplierKeys.stats(organizationId),
      });
      toast.success("Fornecedor criado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar fornecedor");
    },
  });
}

export function useAssociateSupplier(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplierId: string) => {
      const response = await fetch(`/api/suppliers/${supplierId}/associate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to associate supplier");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.list(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: supplierKeys.stats(organizationId),
      });
      toast.success("Fornecedor associado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao associar fornecedor");
    },
  });
}

export function useUpdateSupplier(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      email: string;
      phone: string;
      cnpj: string;
      address?: string;
    }) => {
      const response = await fetch(`/api/suppliers/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update supplier");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.list(organizationId),
      });
      toast.success("Fornecedor atualizado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar fornecedor");
    },
  });
}

export function useDeleteSupplier(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplierId: string) => {
      const response = await fetch(`/api/suppliers/${supplierId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete supplier");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.list(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: supplierKeys.stats(organizationId),
      });
      toast.success("Fornecedor excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir fornecedor");
    },
  });
}

export function useActivateSupplier(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplierId: string) => {
      const response = await fetch(`/api/suppliers/${supplierId}/activate`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to activate supplier");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.list(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: supplierKeys.stats(organizationId),
      });
      toast.success("Fornecedor ativado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao ativar fornecedor");
    },
  });
}

export function useDeactivateSupplier(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplierId: string) => {
      const response = await fetch(`/api/suppliers/${supplierId}/deactivate`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to deactivate supplier");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.list(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: supplierKeys.stats(organizationId),
      });
      toast.success("Fornecedor desativado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao desativar fornecedor");
    },
  });
}

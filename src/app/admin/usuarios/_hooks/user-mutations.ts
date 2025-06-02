"use client";

import type { User } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userKeys } from "./user-keys";

type UserData = {
  name: string;
  email: string;
  whatsapp: string;
};

export function useCreateUser(orgId: string, onDialogClose?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UserData) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list(orgId) });
      if (onDialogClose) onDialogClose();
      toast.success("Usuário criado com sucesso");
    },
    onError: (error) => {
      toast.error("Failed to create user");
      console.error("Create user error:", error);
    },
  });
}

export function useUpdateUser(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      return response.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all(orgId) });
      queryClient.setQueryData(
        userKeys.detail(orgId, updatedUser.id),
        updatedUser,
      );
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update user");
      console.error("Update user error:", error);
    },
  });
}

export function useActivateUser(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/users/${id}/activate`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to activate user");
      }

      return response.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all(orgId) });
      queryClient.setQueryData(
        userKeys.detail(orgId, updatedUser.id),
        updatedUser,
      );
      toast.success("Usuário ativado com sucesso");
    },
    onError: (error) => {
      toast.error("Falha ao ativar usuário");
      console.error("Activate user error:", error);
    },
  });
}

export function useDeactivateUser(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/users/${id}/deactivate`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to deactivate user");
      }

      return response.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all(orgId) });
      queryClient.setQueryData(
        userKeys.detail(orgId, updatedUser.id),
        updatedUser,
      );
      toast.success("Usuário desativado com sucesso");
    },
    onError: (error) => {
      toast.error("Falha ao desativar usuário");
      console.error("Deactivate user error:", error);
    },
  });
}

export function useDeleteUser(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {

      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all(orgId) });
      toast.success("Usuário excluído com sucesso");
    },
    onError: (error) => {
      if (error.message === "Cannot delete active user. Please deactivate first.") {
        toast.error("Não é possível excluir um usuário ativo. Desative-o primeiro.");
      } else {
        toast.error("Falha ao excluir usuário");
      }
      console.error("Delete user error:", error);
    },
  });
}

export function usePasswordReset() {
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}/reset-password`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(
        `Password reset successful. Temporary password: ${data.tempPassword}`,
      );
    },
    onError: () => {
      toast.error("Failed to reset password");
    },
  });
}

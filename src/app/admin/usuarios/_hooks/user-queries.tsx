"use client";

import type { User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query Keys
export const userKeys = {
  all: (orgId: string) => ["users", orgId] as const,
  list: (orgId: string) => [...userKeys.all(orgId), "list"] as const,
  details: (orgId: string) => [...userKeys.all(orgId), "detail"] as const,
  detail: (orgId: string, id: string) =>
    [...userKeys.details(orgId), id] as const,
  stats: (orgId: string) => [...userKeys.all(orgId), "stats"] as const,
};

// Queries
export function useUsers(orgId: string) {
  return useQuery({
    queryKey: userKeys.list(orgId),
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });
}

export function useUser(orgId: string, id: string) {
  return useQuery({
    queryKey: userKeys.detail(orgId, id),
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      return response.json();
    },
    enabled: !!id,
  });
}

export function useUserStats(orgId: string) {
  return useQuery({
    queryKey: userKeys.stats(orgId),
    queryFn: async () => {
      const response = await fetch("/api/users/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch user stats");
      }
      return response.json();
    },
  });
}

type UserData = {
  name: string;
  email: string;
  whatsapp: string;
};

// Mutations
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
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete user");
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

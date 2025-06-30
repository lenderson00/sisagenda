"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types for notifications
export interface Notification {
  id: string;
  title: string;
  content: string;
  payload?: any;
  type: string;
  status: "UNREAD" | "READ" | "ARCHIVED";
  userId: string;
  organizationId: string;
  appointmentId?: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  appointment?: {
    internalId: string;
    date: string;
    deliveryType: {
      name: string;
    };
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Hook to fetch notifications
export const useNotifications = (options?: {
  page?: number;
  limit?: number;
  status?: "UNREAD" | "READ" | "ARCHIVED";
  type?: string;
}) => {
  const { page = 1, limit = 20, status, type } = options || {};

  const searchParams = new URLSearchParams();
  searchParams.set("page", page.toString());
  searchParams.set("limit", limit.toString());
  if (status) searchParams.set("status", status);
  if (type) searchParams.set("type", type);

  return useQuery<NotificationsResponse>({
    queryKey: ["notifications", { page, limit, status, type }],
    queryFn: () =>
      fetch(`/api/notifications?${searchParams.toString()}`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notifications");
        return res.json();
      }),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    retry: 2,
  });
};

// Hook to get unread count
export const useUnreadCount = () => {
  return useQuery<{ count: number }>({
    queryKey: ["notifications", "unread-count"],
    queryFn: () =>
      fetch("/api/notifications/unread-count").then((res) => {
        if (!res.ok) throw new Error("Failed to fetch unread count");
        return res.json();
      }),
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
    retry: 2,
  });
};

// Hook to mark notification as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAsRead" }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notificação marcada como lida");
    },
    onError: (error) => {
      toast.error("Erro ao marcar notificação como lida");
      console.error("Error marking notification as read:", error);
    },
  });
};

// Hook to mark notification as archived
export const useMarkAsArchived = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAsArchived" }),
      });

      if (!response.ok) {
        throw new Error("Failed to archive notification");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notificação arquivada");
    },
    onError: (error) => {
      toast.error("Erro ao arquivar notificação");
      console.error("Error archiving notification:", error);
    },
  });
};

// Hook to mark all notifications as read
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAllAsRead" }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(data.message || "Todas as notificações marcadas como lidas");
    },
    onError: (error) => {
      toast.error("Erro ao marcar todas as notificações como lidas");
      console.error("Error marking all notifications as read:", error);
    },
  });
};

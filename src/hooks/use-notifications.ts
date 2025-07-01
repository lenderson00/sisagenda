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
    id: string
    internalId: string;
    date: string;
    status: string;
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
export const useNotifications = (
  params?: {
    page?: number;
    limit?: number;
    status?: "UNREAD" | "READ" | "ARCHIVED";
    type?: string;
  },
  options?: { enabled?: boolean },
) => {
  const { page = 1, limit = 20, status, type } = params || {};

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
    ...options, // Spread the options here
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

// Hook to approve appointment
export const useApproveAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await fetch(`/api/appointments/${appointmentId}/action`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve appointment");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Agendamento aprovado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao aprovar agendamento");
      console.error("Error approving appointment:", error);
    },
  });
};

// Hook to reject appointment
export const useRejectAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await fetch(`/api/appointments/${appointmentId}/action`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject appointment");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Agendamento rejeitado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao rejeitar agendamento");
      console.error("Error rejecting appointment:", error);
    },
  });
};

// Hook to approve cancellation request
export const useApproveCancellation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await fetch(`/api/appointments/${appointmentId}/action`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_cancellation" }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve cancellation");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Cancelamento aprovado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao aprovar cancelamento");
      console.error("Error approving cancellation:", error);
    },
  });
};

// Hook to reject cancellation request
export const useRejectCancellation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await fetch(`/api/appointments/${appointmentId}/action`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject_cancellation" }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject cancellation");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Cancelamento rejeitado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao rejeitar cancelamento");
      console.error("Error rejecting cancellation:", error);
    },
  });
};

// Hook to approve reschedule request
export const useApproveReschedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await fetch(`/api/appointments/${appointmentId}/action`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_reschedule" }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve reschedule");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Reagendamento aprovado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao aprovar reagendamento");
      console.error("Error approving reschedule:", error);
    },
  });
};

// Hook to reject reschedule request
export const useRejectReschedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await fetch(`/api/appointments/${appointmentId}/action`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject_reschedule" }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject reschedule");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Reagendamento rejeitado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao rejeitar reagendamento");
      console.error("Error rejecting reschedule:", error);
    },
  });
};

// Hook to fetch appointment details
export const useAppointment = (appointmentId?: string) => {
  return useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: async () => {
      if (!appointmentId) return null;

      const response = await fetch(`/api/appointments/${appointmentId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch appointment");
      }
      return response.json();
    },
    enabled: !!appointmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

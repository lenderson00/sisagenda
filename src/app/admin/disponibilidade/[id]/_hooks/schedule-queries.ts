"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleKeys } from "./schedule-keys";
import type { ScheduleFormValues } from "./use-schedule-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useScheduleQuery = (scheduleId: string) => {
  return useQuery({
    queryKey: scheduleKeys.detail(scheduleId),
    queryFn: async () => {
      const response = await fetch(`/api/schedules/${scheduleId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch schedule");
      }
      return response.json();
    },
    enabled: !!scheduleId && scheduleId !== "novo",
  });
};

export const useCreateScheduleMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ScheduleFormValues) => {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create schedule");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      toast.success("Horário criado com sucesso!");
      router.push("/admin/disponibilidade");
      router.refresh();
    },
    onError: () => {
      toast.error("Erro ao criar o horário.");
    },
  });
};

export const useUpdateScheduleMutation = (scheduleId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ScheduleFormValues) => {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update schedule");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(scheduleId) });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      toast.success("Horário atualizado com sucesso!");
      router.push("/admin/disponibilidade");
      router.refresh();
    },
    onError: () => {
      toast.error("Erro ao atualizar o horário.");
    },
  });
};

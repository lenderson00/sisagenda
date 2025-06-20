"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "sonner";

type AppointmentInput = {
  organizationId: string;
  deliveryTypeId: string;
  dateTime: Date;
  ordemDeCompra: string;
  observations: Record<string, any>;
};

async function createAppointment(input: AppointmentInput) {
  const response = await fetch("/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || "Ocorreu um erro ao criar o agendamento.",
    );
  }

  return response.json();
}

export function useCreateAppointment(
  organizationId: string,
  deliveryTypeId: string,
  dateKey: Date,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "availability",
          organizationId,
          deliveryTypeId,
          dayjs(dateKey).format("YYYY-MM-DD"),
        ],
      });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Agendamento solicitado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

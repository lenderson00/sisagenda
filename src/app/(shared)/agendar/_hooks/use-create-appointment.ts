"use client";

import type { FileMetadata } from "@/app/(shared)/agendar/_component/file-uploader";
import dayjs from "@/lib/dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

const itemSchema = z.object({
  pi: z.string().optional(),
  name: z.string(),
  unit: z.string(),
  quantity: z.number(),
  price: z.number(),
});

const createAppointmentInput = z.object({
  organizationId: z.string(),
  deliveryTypeId: z.string(),
  dateTime: z.date(),
  ordemDeCompra: z.string(),
  notaFiscal: z.string(),
  isFirstDelivery: z.boolean(),
  processNumber: z.string().optional(),
  needsLabAnalysis: z.boolean(),
  items: z.array(itemSchema),
  observation: z.string().optional(),
  attachments: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      size: z.number(),
      type: z.string(),
    }),
  ),
});

type CreateAppointmentInput = z.infer<typeof createAppointmentInput>;

async function createAppointment(input: CreateAppointmentInput) {
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

export function useCreateAppointment() {
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

"use client";

import { useRouter } from "next/navigation";

export type AgendamentoStep =
  | "OM"
  | "DELIVERY"
  | "DATE"
  | "FORM"
  | "VALIDATE"
  | "SUBMIT";

export function useAgendamentoProgress() {
  const router = useRouter();

  const continueTo = (step: AgendamentoStep) => {
    router.push(`/agendamento/${step}`);
  };

  const finish = async (id: string) => {
    router.push(`/agendamento/${id}`);
  };

  return { continueTo, finish };
}

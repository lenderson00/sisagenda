"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  type AgendamentoStep,
  useAgendamentoProgress,
} from "../_hooks/use-agendar-progress";

export function NextButton({
  step,
  ...rest
}: { step: AgendamentoStep } & ButtonProps) {
  const { continueTo } = useAgendamentoProgress();

  return (
    <Button variant="default" onClick={() => continueTo(step)} {...rest} />
  );
}

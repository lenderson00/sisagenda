"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentWithRelations } from "../types/app";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { AllowedActions } from "./appointment-actions";
import { RescheduleDialog } from "./reschedule-dialog";

interface AppointmentActionButtonsProps {
  appointment: AppointmentWithRelations;
  allowedActions: AllowedActions;
}

export function AppointmentActionButtons({
  appointment,
  allowedActions,
}: AppointmentActionButtonsProps) {
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const { id: appointmentId, date: currentDate } = appointment;
  const queryClient = useQueryClient();

  const { mutate: handleAction, isPending: isLoading } = useMutation({
    mutationFn: async ({
      action,
      payload,
    }: {
      action: string;
      payload?: any;
    }) => {
      const res = await fetch(`/api/appointments/${appointmentId}/action`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Sucesso!", {
        description: "A ação foi executada com sucesso.",
      });
      if (isRescheduleDialogOpen) {
        setIsRescheduleDialogOpen(false);
      }
      queryClient.invalidateQueries({
        queryKey: ["appointment", appointmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["appointment-activities", appointmentId],
      });
    },
    onError: (error: Error) => {
      toast.error("Erro!", {
        description: error.message,
      });
    },
  });

  const hasActions = Object.values(allowedActions).some((v) => v === true);

  if (!hasActions) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {allowedActions.canApprove && (
          <Button
            onClick={() => handleAction({ action: "approve" })}
            disabled={isLoading}
            className="w-full"
          >
            Aprovar
          </Button>
        )}
        {allowedActions.canReject && (
          <Button
            onClick={() => handleAction({ action: "reject" })}
            disabled={isLoading}
            variant="destructive"
            className="w-full"
          >
            Rejeitar
          </Button>
        )}

        {allowedActions.canApproveOrRejectCancellation && (
          <>
            <Button
              onClick={() => handleAction({ action: "approve_cancellation" })}
              disabled={isLoading}
              className="w-full"
            >
              Aprovar Cancelamento
            </Button>
            <Button
              onClick={() => handleAction({ action: "reject_cancellation" })}
              disabled={isLoading}
              variant="destructive"
              className="w-full"
            >
              Rejeitar Cancelamento
            </Button>
          </>
        )}

        {allowedActions.canApproveOrRejectReschedule && (
          <>
            <Button
              onClick={() => handleAction({ action: "approve_reschedule" })}
              disabled={isLoading}
              className="w-full"
            >
              Aprovar Reagendamento
            </Button>
            <Button
              onClick={() => handleAction({ action: "reject_reschedule" })}
              disabled={isLoading}
              variant="destructive"
              className="w-full"
            >
              Rejeitar Reagendamento
            </Button>
          </>
        )}

        {allowedActions.canCancel && (
          <Button
            onClick={() => handleAction({ action: "cancel" })}
            disabled={isLoading}
            variant="destructive"
            className="w-full"
          >
            Cancelar
          </Button>
        )}
        {allowedActions.canReschedule && (
          <Button disabled={isLoading} className="w-full">
            Reagendar
          </Button>
        )}

        {allowedActions.canRequestCancellation && (
          <Button
            onClick={() => handleAction({ action: "request_cancellation" })}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            Solicitar Cancelamento
          </Button>
        )}
        {allowedActions.canRequestReschedule && (
          <>
            <Button
              onClick={() => setIsRescheduleDialogOpen(true)}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              Solicitar Reagendamento
            </Button>
            <RescheduleDialog
              appointmentId={appointmentId}
              currentDate={currentDate}
              open={isRescheduleDialogOpen}
              onOpenChange={setIsRescheduleDialogOpen}
            />
          </>
        )}

        {allowedActions.canEdit && (
          <Button disabled={isLoading} className="w-full">
            Editar
          </Button>
        )}

        {allowedActions.canMarkAsNoShow && (
          <Button
            onClick={() => handleAction({ action: "mark_as_no_show" })}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            Marcar como Não Compareceu
          </Button>
        )}
        {allowedActions.canMarkAsCompleted && (
          <Button
            onClick={() => handleAction({ action: "mark_as_completed" })}
            disabled={isLoading}
            className="w-full"
          >
            Marcar como Concluído
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

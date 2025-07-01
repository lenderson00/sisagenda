"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Ban,
  CalendarClock,
  CalendarPlus,
  Check,
  CheckCircle2,
  Edit3,
  FileText,
  UserX,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { AppointmentWithRelationsAndStringPrice } from "../types/app";
import type { AllowedActions } from "./appointment-actions";
import { RescheduleDialog } from "./reschedule-dialog";

interface AppointmentActionButtonsProps {
  appointment: AppointmentWithRelationsAndStringPrice;
  allowedActions: AllowedActions;
}

interface ActionDetails {
  action: string;
  payload?: any;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  confirmButtonVariant?: "default" | "destructive";
  icon?: LucideIcon;
}

export function AppointmentActionButtons(props: AppointmentActionButtonsProps) {
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [currentActionDetails, setCurrentActionDetails] =
    useState<ActionDetails | null>(null);

  const router = useRouter();

  // Guard against undefined appointment prop
  if (!props?.appointment) {
    return null;
  }

  const { appointment, allowedActions } = props;
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
        const errorData = await res
          .json()
          .catch(() => ({ message: res.statusText }));
        throw new Error(
          errorData.message || "Ocorreu um erro ao processar a ação.",
        );
      }
      return res.json();
    },
    onSuccess: (data, variables) => {
      toast.success("Sucesso!", {
        description: `A ação "${variables.action}" foi executada com sucesso.`,
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

      router.refresh();
    },
    onError: (error: Error) => {
      toast.error("Erro!", {
        description: error.message,
      });
    },
    onSettled: () => {
      setIsConfirmationDialogOpen(false);
      setCurrentActionDetails(null);
    },
  });

  const openConfirmationModal = (details: ActionDetails) => {
    setCurrentActionDetails(details);
    setIsConfirmationDialogOpen(true);
  };

  const onConfirmAction = () => {
    if (currentActionDetails) {
      handleAction({
        action: currentActionDetails.action,
        payload: currentActionDetails.payload,
      });
    }
  };

  // This function would be called by RescheduleDialog's onFormSubmit prop
  const handleRescheduleFormSubmit = (payload: {
    newDate: string;
    reason?: string;
  }) => {
    setIsRescheduleDialogOpen(false); // Close the RescheduleDialog form

    const isDirectReschedule = allowedActions.canReschedule;
    const action = isDirectReschedule ? "reschedule" : "request_reschedule";
    const title = isDirectReschedule
      ? "Confirmar Reagendamento"
      : "Confirmar Solicitação de Reagendamento";
    const confirmText = isDirectReschedule
      ? "Confirmar Reagendamento"
      : "Confirmar Solicitação";
    const description = (
      <p>
        Você tem certeza que deseja{" "}
        {isDirectReschedule ? "reagendar" : "solicitar o reagendamento"} desta
        consulta para
        <strong className="mx-1">
          {new Date(payload.newDate).toLocaleString()}
        </strong>
        ?
        {payload.reason && (
          <>
            <br />
            Motivo: {payload.reason}
          </>
        )}
      </p>
    );

    openConfirmationModal({
      action,
      payload,
      title,
      description,
      confirmText,
      icon: isDirectReschedule ? CalendarClock : CalendarPlus,
    });
  };

  const hasActions = Object.values(allowedActions).some((v) => v === true);

  if (!hasActions) {
    return null;
  }

  const actionButtonClass = "w-full justify-start px-3";
  const iconClass = "w-4 h-4 mr-2";

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {allowedActions.canApprove && (
            <Button
              onClick={() =>
                openConfirmationModal({
                  action: "approve",
                  title: "Aprovar Agendamento",
                  description:
                    "Tem certeza que deseja aprovar este agendamento?",
                  icon: Check,
                })
              }
              disabled={isLoading}
              className={`${actionButtonClass} bg-background text-foreground hover:bg-accent hover:text-accent-foreground`}
              variant="outline"
            >
              <Check className={iconClass} />
              Aprovar Agendamento
            </Button>
          )}
          {allowedActions.canReject && (
            <Button
              onClick={() =>
                openConfirmationModal({
                  action: "reject",
                  title: "Rejeitar Agendamento",
                  description:
                    "Tem certeza que deseja rejeitar este agendamento?",
                  confirmButtonVariant: "destructive",
                  icon: X,
                })
              }
              disabled={isLoading}
              variant="destructive"
              className={actionButtonClass}
            >
              <X className={iconClass} />
              Rejeitar Agendamento
            </Button>
          )}

          {allowedActions.canApproveOrRejectCancellation && (
            <>
              <Button
                onClick={() =>
                  openConfirmationModal({
                    action: "approve_cancellation",
                    title: "Aprovar Cancelamento",
                    description:
                      "Tem certeza que deseja aprovar a solicitação de cancelamento?",
                    icon: Check,
                  })
                }
                disabled={isLoading}
                className={actionButtonClass}
              >
                <Check className={iconClass} />
                Aprovar Cancelamento
              </Button>
              <Button
                onClick={() =>
                  openConfirmationModal({
                    action: "reject_cancellation",
                    title: "Rejeitar Cancelamento",
                    description:
                      "Tem certeza que deseja rejeitar a solicitação de cancelamento?",
                    confirmButtonVariant: "destructive",
                    icon: X,
                  })
                }
                disabled={isLoading}
                variant="destructive"
                className={actionButtonClass}
              >
                <X className={iconClass} />
                Rejeitar Cancelamento
              </Button>
            </>
          )}

          {allowedActions.canApproveOrRejectReschedule && (
            <>
              <Button
                onClick={() =>
                  openConfirmationModal({
                    action: "approve_reschedule",
                    title: "Aprovar Reagendamento",
                    description:
                      "Tem certeza que deseja aprovar a solicitação de reagendamento?",
                    icon: Check,
                  })
                }
                disabled={isLoading}
                className={actionButtonClass}
              >
                <Check className={iconClass} />
                Aprovar Reagendamento
              </Button>
              <Button
                onClick={() =>
                  openConfirmationModal({
                    action: "reject_reschedule",
                    title: "Rejeitar Reagendamento",
                    description:
                      "Tem certeza que deseja rejeitar a solicitação de reagendamento?",
                    confirmButtonVariant: "destructive",
                    icon: X,
                  })
                }
                disabled={isLoading}
                variant="destructive"
                className={actionButtonClass}
              >
                <X className={iconClass} />
                Rejeitar Reagendamento
              </Button>
            </>
          )}

          {allowedActions.canCancel && (
            <Button
              onClick={() =>
                openConfirmationModal({
                  action: "cancel",
                  title: "Cancelar Agendamento",
                  description:
                    "Tem certeza que deseja cancelar este agendamento? Esta ação pode ser irreversível.",
                  confirmButtonVariant: "destructive",
                  icon: Ban,
                })
              }
              disabled={isLoading}
              variant="destructive"
              className={actionButtonClass}
            >
              <Ban className={iconClass} />
              Cancelar Agendamento
            </Button>
          )}
          {allowedActions.canReschedule && (
            <Button
              onClick={() => setIsRescheduleDialogOpen(true)}
              disabled={isLoading}
              className={`${actionButtonClass} bg-background text-foreground hover:bg-accent hover:text-accent-foreground`}
              variant="outline"
            >
              <CalendarClock className={iconClass} />
              Reagendar
            </Button>
          )}

          {allowedActions.canRequestCancellation && (
            <Button
              onClick={() =>
                openConfirmationModal({
                  action: "request_cancellation",
                  title: "Solicitar Cancelamento",
                  description:
                    "Tem certeza que deseja solicitar o cancelamento deste agendamento?",
                  icon: FileText,
                })
              }
              disabled={isLoading}
              variant="outline"
              className={`${actionButtonClass} bg-background text-foreground hover:bg-accent hover:text-accent-foreground`}
            >
              <FileText className={iconClass} />
              Solicitar Cancelamento
            </Button>
          )}
          {allowedActions.canRequestReschedule && (
            <Button
              onClick={() => setIsRescheduleDialogOpen(true)}
              disabled={isLoading}
              variant="outline"
              className={`${actionButtonClass} bg-background text-foreground hover:bg-accent hover:text-accent-foreground`}
            >
              <CalendarPlus className={iconClass} />
              Solicitar Reagendamento
            </Button>
          )}

          {allowedActions.canEdit && (
            <Button
              onClick={() =>
                openConfirmationModal({
                  action: "edit",
                  title: "Editar Agendamento",
                  description:
                    "Tem certeza que deseja editar os detalhes deste agendamento?",
                  icon: Edit3,
                })
              }
              disabled={isLoading}
              className={`${actionButtonClass} bg-background text-foreground hover:bg-accent hover:text-accent-foreground`}
              variant="outline"
            >
              <Edit3 className={iconClass} />
              Editar Agendamento
            </Button>
          )}

          {allowedActions.canMarkAsNoShow && (
            <Button
              onClick={() =>
                openConfirmationModal({
                  action: "mark_as_no_show",
                  title: "Marcar como Não Compareceu",
                  description:
                    "Tem certeza que deseja marcar este agendamento como não comparecido?",
                  confirmButtonVariant: "destructive",
                  icon: UserX,
                })
              }
              disabled={isLoading}
              variant="outline"
              className={`${actionButtonClass} bg-background text-destructive border-destructive hover:bg-destructive/10`}
            >
              <UserX className={iconClass} />
              Marcar como Não Compareceu
            </Button>
          )}
          {allowedActions.canMarkAsCompleted && (
            <Button
              onClick={() =>
                openConfirmationModal({
                  action: "mark_as_completed",
                  title: "Marcar como Concluído",
                  description:
                    "Tem certeza que deseja marcar este agendamento como concluído?",
                  icon: CheckCircle2,
                })
              }
              disabled={isLoading}
              className={`${actionButtonClass} bg-green-600 text-white hover:bg-green-700`}
            >
              <CheckCircle2 className={iconClass} />
              Marcar como Concluído
            </Button>
          )}
        </CardContent>
      </Card>

      {currentActionDetails && (
        <ConfirmationDialog
          open={isConfirmationDialogOpen}
          onOpenChange={setIsConfirmationDialogOpen}
          title={currentActionDetails.title}
          description={currentActionDetails.description}
          onConfirm={onConfirmAction}
          confirmText={currentActionDetails.confirmText}
          confirmButtonVariant={currentActionDetails.confirmButtonVariant}
          isLoading={isLoading}
          icon={currentActionDetails.icon || AlertTriangle}
        />
      )}

      {(allowedActions.canReschedule ||
        allowedActions.canRequestReschedule) && (
        <RescheduleDialog
          appointmentId={appointmentId}
          currentDate={currentDate}
          open={isRescheduleDialogOpen}
          onOpenChange={setIsRescheduleDialogOpen}
          onFormSubmit={handleRescheduleFormSubmit}
        />
      )}
    </>
  );
}

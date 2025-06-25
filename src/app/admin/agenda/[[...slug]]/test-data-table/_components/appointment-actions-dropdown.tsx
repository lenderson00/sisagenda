"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  IconDotsVertical,
  IconEye,
  IconCheck,
  IconX,
  IconCalendarOff,
  IconMessage,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import type { AppointmentWithRelations } from "../../page-client";
import {
  ActionsProvider,
  useAllowedActions,
} from "@/app/(shared)/agendamentos/[id]/_context/actions-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AppointmentActionsDropdownProps {
  appointment: AppointmentWithRelations;
}

// Create a compatible type for the ActionsProvider
type CompatibleAppointmentWithRelations = AppointmentWithRelations & {
  activities: any[];
};

type ActionType =
  | "approve"
  | "reject"
  | "cancel"
  | "approve_cancellation"
  | "reject_cancellation"
  | "approve_reschedule"
  | "reject_reschedule"
  | "mark_as_completed"
  | "mark_as_no_show"
  | "request_cancellation";

function AppointmentActionsContent({
  appointment,
}: {
  appointment: AppointmentWithRelations;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const allowedActions = useAllowedActions();
  const [isLoading, setIsLoading] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<ActionType | null>(
    null,
  );
  const queryClient = useQueryClient();

  const handleAction = async (action: ActionType, payload?: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/appointments/${appointment.id}/action`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            payload,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to perform action");
      }

      toast.success("Ação realizada com sucesso!");
      await queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["appointment", appointment.id],
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao realizar ação",
      );
      console.error("Action error:", error);
    } finally {
      setIsLoading(false);
      setActionToConfirm(null);
    }
  };

  const handleViewDetails = () => {
    router.push(`/agendamentos/${appointment.id}`);
  };

  const handleContactSupplier = () => {
    if (appointment.user.whatsapp) {
      const message = `Olá ${appointment.user.name}, gostaria de falar sobre o agendamento #${appointment.internalId || appointment.id}`;
      const whatsappUrl = `https://wa.me/${appointment.user.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    } else {
      toast.error("WhatsApp não disponível para este fornecedor");
    }
  };

  const handleOpenChat = () => {
    router.push(`/chat/${appointment.id}`);
  };

  const openConfirmationDialog = (e: Event, action: ActionType) => {
    e.preventDefault();
    setActionToConfirm(action);
  };

  const getDialogContent = (action: ActionType | null) => {
    if (!action) return { title: "", description: "" };
    switch (action) {
      case "approve":
        return {
          title: "Confirmar agendamento?",
          description:
            "Esta ação irá confirmar o agendamento. Deseja continuar?",
        };
      case "reject":
        return {
          title: "Rejeitar agendamento?",
          description:
            "Esta ação irá rejeitar o agendamento. Deseja continuar?",
        };
      case "cancel":
        return {
          title: "Cancelar agendamento?",
          description:
            "Esta ação irá cancelar o agendamento. Deseja continuar?",
        };
      case "approve_cancellation":
        return {
          title: "Aprovar cancelamento?",
          description:
            "Esta ação irá aprovar o cancelamento do agendamento. Deseja continuar?",
        };
      case "reject_cancellation":
        return {
          title: "Rejeitar cancelamento?",
          description:
            "Esta ação irá rejeitar o cancelamento do agendamento. Deseja continuar?",
        };
      case "approve_reschedule":
        return {
          title: "Aprovar reagendamento?",
          description:
            "Esta ação irá aprovar o reagendamento. Deseja continuar?",
        };
      case "reject_reschedule":
        return {
          title: "Rejeitar reagendamento?",
          description:
            "Esta ação irá rejeitar o reagendamento. Deseja continuar?",
        };
      case "mark_as_completed":
        return {
          title: "Marcar como concluído?",
          description:
            "Esta ação irá marcar o agendamento como concluído. Deseja continuar?",
        };
      case "mark_as_no_show":
        return {
          title: "Marcar como não compareceu?",
          description:
            "Esta ação irá marcar o agendamento como não compareceu. Deseja continuar?",
        };
      case "request_cancellation":
        return {
          title: "Solicitar cancelamento?",
          description:
            "Esta ação irá solicitar o cancelamento do agendamento. Deseja continuar?",
        };
      default:
        return {
          title: "Confirmar ação?",
          description: "Tem certeza de que deseja executar esta ação?",
        };
    }
  };

  const dialogContent = getDialogContent(actionToConfirm);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isLoading}
          >
            <IconDotsVertical className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Always available actions */}
          <DropdownMenuItem onClick={handleViewDetails}>
            <IconEye className="mr-2 h-4 w-4" />
            Ver detalhes
          </DropdownMenuItem>

          {/* Contact actions */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleContactSupplier}>
            <IconBrandWhatsapp className="mr-2 h-4 w-4" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenChat}>
            <IconMessage className="mr-2 h-4 w-4" />
            Chat
          </DropdownMenuItem>

          {/* Status-dependent actions */}
          {allowedActions.canApprove && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => openConfirmationDialog(e, "approve")}
                className="text-green-600"
              >
                <IconCheck className="mr-2 h-4 w-4" />
                Confirmar
              </DropdownMenuItem>
            </>
          )}

          {allowedActions.canReject && (
            <DropdownMenuItem
              onSelect={(e) => openConfirmationDialog(e, "reject")}
              className="text-red-600"
            >
              <IconX className="mr-2 h-4 w-4" />
              Rejeitar
            </DropdownMenuItem>
          )}

          {allowedActions.canCancel && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => openConfirmationDialog(e, "cancel")}
                className="text-red-600"
              >
                <IconCalendarOff className="mr-2 h-4 w-4" />
                Cancelar
              </DropdownMenuItem>
            </>
          )}

          {allowedActions.canApproveOrRejectCancellation && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) =>
                  openConfirmationDialog(e, "approve_cancellation")
                }
                className="text-green-600"
              >
                <IconCheck className="mr-2 h-4 w-4" />
                Aprovar Cancelamento
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) =>
                  openConfirmationDialog(e, "reject_cancellation")
                }
                className="text-red-600"
              >
                <IconX className="mr-2 h-4 w-4" />
                Rejeitar Cancelamento
              </DropdownMenuItem>
            </>
          )}

          {allowedActions.canApproveOrRejectReschedule && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) =>
                  openConfirmationDialog(e, "approve_reschedule")
                }
                className="text-green-600"
              >
                <IconCheck className="mr-2 h-4 w-4" />
                Aprovar Reagendamento
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => openConfirmationDialog(e, "reject_reschedule")}
                className="text-red-600"
              >
                <IconX className="mr-2 h-4 w-4" />
                Rejeitar Reagendamento
              </DropdownMenuItem>
            </>
          )}

          {allowedActions.canMarkAsCompleted && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => openConfirmationDialog(e, "mark_as_completed")}
                className="text-green-600"
              >
                <IconCheck className="mr-2 h-4 w-4" />
                Marcar como Concluído
              </DropdownMenuItem>
            </>
          )}

          {allowedActions.canMarkAsNoShow && (
            <DropdownMenuItem
              onSelect={(e) => openConfirmationDialog(e, "mark_as_no_show")}
              className="text-red-600"
            >
              <IconX className="mr-2 h-4 w-4" />
              Não Compareceu
            </DropdownMenuItem>
          )}

          {allowedActions.canRequestCancellation && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) =>
                  openConfirmationDialog(e, "request_cancellation")
                }
                className="text-red-600"
              >
                <IconCalendarOff className="mr-2 h-4 w-4" />
                Solicitar Cancelamento
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={!!actionToConfirm}
        onOpenChange={(open) => !open && setActionToConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => actionToConfirm && handleAction(actionToConfirm)}
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Wrapper component that provides the context
export function AppointmentActionsDropdown({
  appointment,
}: AppointmentActionsDropdownProps) {
  // Create a compatible appointment object
  const compatibleAppointment = {
    ...appointment,
    activities: [], // Assuming activities are not needed for this context
  };

  return (
    <ActionsProvider appointment={compatibleAppointment}>
      <AppointmentActionsContent appointment={appointment} />
    </ActionsProvider>
  );
}

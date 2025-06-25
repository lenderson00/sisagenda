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
  IconDotsVertical,
  IconEye,
  IconCheck,
  IconX,
  IconCalendarOff,
  IconCalendarTime,
  IconEdit,
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

interface AppointmentActionsDropdownProps {
  appointment: AppointmentWithRelations;
}

// Create a compatible type for the ActionsProvider
type CompatibleAppointmentWithRelations = AppointmentWithRelations & {
  activities: any[];
};

function AppointmentActionsContent({
  appointment,
}: { appointment: AppointmentWithRelations }) {
  const { data: session } = useSession();
  const router = useRouter();
  const allowedActions = useAllowedActions();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: string, payload?: any) => {
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
      // Refresh the page or invalidate queries
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao realizar ação",
      );
      console.error("Action error:", error);
    } finally {
      setIsLoading(false);
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

  return (
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
              onClick={() => handleAction("approve")}
              className="text-green-600"
            >
              <IconCheck className="mr-2 h-4 w-4" />
              Confirmar
            </DropdownMenuItem>
          </>
        )}

        {allowedActions.canReject && (
          <DropdownMenuItem
            onClick={() => handleAction("reject")}
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
              onClick={() => handleAction("cancel")}
              className="text-red-600"
            >
              <IconCalendarOff className="mr-2 h-4 w-4" />
              Cancelar
            </DropdownMenuItem>
          </>
        )}

        {allowedActions.canReschedule && (
          <DropdownMenuItem onClick={() => handleAction("reschedule")}>
            <IconCalendarTime className="mr-2 h-4 w-4" />
            Reagendar
          </DropdownMenuItem>
        )}

        {allowedActions.canApproveOrRejectCancellation && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleAction("approve_cancellation")}
              className="text-green-600"
            >
              <IconCheck className="mr-2 h-4 w-4" />
              Aprovar Cancelamento
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction("reject_cancellation")}
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
              onClick={() => handleAction("approve_reschedule")}
              className="text-green-600"
            >
              <IconCheck className="mr-2 h-4 w-4" />
              Aprovar Reagendamento
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction("reject_reschedule")}
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
              onClick={() => handleAction("mark_as_completed")}
              className="text-green-600"
            >
              <IconCheck className="mr-2 h-4 w-4" />
              Marcar como Concluído
            </DropdownMenuItem>
          </>
        )}

        {allowedActions.canMarkAsNoShow && (
          <DropdownMenuItem
            onClick={() => handleAction("mark_as_no_show")}
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
              onClick={() => handleAction("request_cancellation")}
              className="text-red-600"
            >
              <IconCalendarOff className="mr-2 h-4 w-4" />
              Solicitar Cancelamento
            </DropdownMenuItem>
          </>
        )}

        {allowedActions.canRequestReschedule && (
          <DropdownMenuItem onClick={() => handleAction("request_reschedule")}>
            <IconCalendarTime className="mr-2 h-4 w-4" />
            Solicitar Reagendamento
          </DropdownMenuItem>
        )}

        {allowedActions.canEdit && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAction("edit")}>
              <IconEdit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppointmentActionsDropdown({
  appointment,
}: AppointmentActionsDropdownProps) {
  // Create a compatible appointment object for the ActionsProvider
  const compatibleAppointment: CompatibleAppointmentWithRelations = {
    ...appointment,
    activities: [],
  };

  return (
    <ActionsProvider appointment={compatibleAppointment}>
      <AppointmentActionsContent appointment={appointment} />
    </ActionsProvider>
  );
}

"use client";

import type { AppointmentActivity, User } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ActivityIcon } from "lucide-react";

const getActivityDescription = (activity: AppointmentActivity) => {
  switch (activity.type) {
    case "CREATED":
      return "criou o agendamento";
    case "UPDATED":
      return "atualizou o agendamento";
    case "CANCELLED":
      return "cancelou o agendamento";
    case "COMPLETED":
      return "marcou como concluído";
    case "COMMENT":
      return `comentou: "${activity.content || activity.title}"`;
    case "STATUS_CHANGE":
      return `alterou o status ${activity.previousStatus ? `de ${activity.previousStatus}` : ""} para ${(activity.metadata as any)?.newStatus || "novo status"}`;
    case "RESCHEDULE_REQUESTED":
      return "solicitou reagendamento";
    case "RESCHEDULE_CONFIRMED":
      return "confirmou o reagendamento";
    case "RESCHEDULE_REJECTED":
      return "rejeitou o reagendamento";
    case "SUPPLIER_NO_SHOW":
      return "marcou que o fornecedor não compareceu";
    case "DELIVERY_CONFIRMED":
      return "confirmou a entrega";
    case "DELIVERY_REJECTED":
      return "rejeitou a entrega";
    case "OTHER":
      return activity.title || "realizou uma atividade";
    default:
      return "realizou uma atividade desconhecida";
  }
};

const getActivityTitle = (activity: AppointmentActivity) => {
  switch (activity.type) {
    case "COMMENT":
      return "Comentário";
    case "CREATED":
      return "Agendamento Criado";
    case "UPDATED":
      return "Agendamento Atualizado";
    case "CANCELLED":
      return "Solicitação de Cancelamento";
    case "RESCHEDULE_REQUESTED":
      return "Solicitação de Reagendamento";
    case "RESCHEDULE_CONFIRMED":
      return "Reagendamento Confirmado";
    case "RESCHEDULE_REJECTED":
      return "Reagendamento Rejeitado";
    case "STATUS_CHANGE":
      return "Status Alterado";
    default:
      return "Atividade";
  }
};

const getActivityDetails = (activity: AppointmentActivity) => {
  const metadata = activity.metadata as any;

  switch (activity.type) {
    case "COMMENT":
      return {
        description: "Comentário adicionado ao agendamento",
        content: activity.content,
        details: null,
      };
    case "CANCELLED":
      return {
        description: "Solicitação de cancelamento do agendamento",
        content: activity.content,
        details:
          "Este agendamento foi marcado para cancelamento e aguarda aprovação.",
      };
    case "RESCHEDULE_REQUESTED":
      return {
        description: "Solicitação de reagendamento do agendamento",
        content: activity.content,
        details: metadata?.proposedDate
          ? `Nova data proposta: ${new Date(metadata.proposedDate).toLocaleDateString("pt-BR")}`
          : null,
      };
    case "RESCHEDULE_CONFIRMED":
      return {
        description: "O reagendamento foi confirmado",
        content: activity.content,
        details: metadata?.newDate
          ? `Nova data confirmada: ${new Date(metadata.newDate).toLocaleDateString("pt-BR")}`
          : null,
      };
    case "RESCHEDULE_REJECTED":
      return {
        description: "A solicitação de reagendamento foi rejeitada",
        content: activity.content,
        details: null,
      };
    case "CREATED":
      return {
        description: "Agendamento criado no sistema",
        content: activity.content || "Novo agendamento foi criado com sucesso.",
        details: `Criado em ${format(new Date(activity.createdAt), "PPP 'às' p", { locale: ptBR })}`,
      };
    default:
      return {
        description: "Atividade do agendamento",
        content: activity.content || "Atividade realizada no agendamento.",
        details: null,
      };
  }
};

export function AppointmentActivityItem({
  activity,
}: {
  activity: AppointmentActivity & {
    user: User;
  };
}) {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const handleActivityClick = () => {
    setIsDetailDialogOpen(true);
  };

  const activityDetails = getActivityDetails(activity);

  return (
    <>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-medium text-gray-900">
              {activity.user.name}
            </span>{" "}
            <button
              type="button"
              onClick={handleActivityClick}
              className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              {getActivityDescription(activity)}
            </button>{" "}
            <span className="text-gray-500">
              •{" "}
              {formatDistanceToNow(new Date(activity.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </p>
        </div>
      </div>
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-blue-600" />
              {getActivityTitle(activity)}
            </DialogTitle>
            <DialogDescription>
              Por {activity.user?.name || "Usuário"} •{" "}
              {format(new Date(activity.createdAt), "PPP 'às' p", {
                locale: ptBR,
              })}
            </DialogDescription>
          </DialogHeader>

          {activityDetails && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  {activityDetails.description}
                </h4>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {activityDetails.content}
                  </p>
                </div>
              </div>

              {activityDetails.details && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Detalhes Adicionais
                  </h4>
                  <p className="text-sm text-gray-600">
                    {activityDetails.details}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { AppointmentActivity, User } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  FileText,
  MessageCircle,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AppointmentActivityListProps {
  appointmentId: string;
  initialActivities: (AppointmentActivity & {
    user: User;
  })[];
  currentUser: {
    name: string;
  };
}

interface CommentFormData {
  content: string;
}

const getActivityDescription = (activity: AppointmentActivity) => {
  switch (activity.type) {
    case "COMMENT": {
      const content = activity.content || "";
      const shortComment =
        content.length > 50 ? `${content.substring(0, 50)}...` : content;
      return `comentou: ${shortComment}`;
    }
    case "CREATED":
      return "criou o agendamento";
    case "UPDATED":
      return "atualizou o agendamento";
    case "CANCELLED":
      return "solicitou cancelamento";
    case "RESCHEDULE_REQUESTED":
      return "solicitou reagendamento";
    case "RESCHEDULE_CONFIRMED":
      return "confirmou reagendamento";
    case "RESCHEDULE_REJECTED":
      return "rejeitou reagendamento";
    case "STATUS_CHANGE":
      return "alterou o status";
    default:
      return activity.content || "realizou uma ação";
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "COMMENT":
      return MessageCircle;
    case "CREATED":
      return Calendar;
    case "CANCELLED":
      return X;
    case "RESCHEDULE_REQUESTED":
    case "RESCHEDULE_CONFIRMED":
    case "RESCHEDULE_REJECTED":
      return RotateCcw;
    default:
      return FileText;
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

export function AppointmentActivityList({
  appointmentId,
  initialActivities,
  currentUser,
}: AppointmentActivityListProps) {
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<
    (AppointmentActivity & { user: User }) | null
  >(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Use React Query to manage activities with real-time updates
  const { data: activities = initialActivities } = useQuery<
    (AppointmentActivity & { user: User })[]
  >({
    queryKey: ["appointment-activities", appointmentId],
    queryFn: async () => {
      const response = await fetch(
        `/api/appointments/${appointmentId}/activities`,
      );
      if (!response.ok) throw new Error("Failed to fetch activities");
      return response.json();
    },
    initialData: initialActivities,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const {
    register: registerComment,
    handleSubmit: handleSubmitComment,
    reset: resetCommentForm,
    formState: { errors: commentErrors },
  } = useForm<CommentFormData>();

  const onCommentSubmit = async (data: CommentFormData) => {
    setIsSubmittingComment(true);
    try {
      const response = await fetch(
        `/api/appointments/${appointmentId}/activities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "COMMENT",
            content: data.content,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      await response.json();

      // Invalidate and refetch activities
      await queryClient.invalidateQueries({
        queryKey: ["appointment-activities", appointmentId],
      });

      resetCommentForm();
      toast.success("Comentário adicionado com sucesso!");
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error("Erro ao adicionar comentário");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleActivityClick = (
    activity: AppointmentActivity & { user: User },
  ) => {
    setSelectedActivity(activity);
    setIsDetailDialogOpen(true);
  };

  const activityDetails = selectedActivity
    ? getActivityDetails(selectedActivity)
    : null;
  const ActivityIcon = selectedActivity
    ? getActivityIcon(selectedActivity.type)
    : FileText;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Activities Timeline */}
          <div className="space-y-3 mb-6">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhuma atividade registrada ainda.</p>
                <p className="text-sm">Seja o primeiro a comentar!</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage src={activity.user.image || undefined} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                      {activity.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-medium text-gray-900">
                        {activity.user.name}
                      </span>{" "}
                      <button
                        type="button"
                        onClick={() => handleActivityClick(activity)}
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
              ))
            )}
          </div>

          {/* Comment Form */}
          <div className="border-t pt-4">
            <form onSubmit={handleSubmitComment(onCommentSubmit)}>
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Deixe um comentário..."
                    className="min-h-[80px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...registerComment("content", {
                      required: "O comentário não pode estar vazio",
                    })}
                  />
                  {commentErrors.content && (
                    <p className="text-sm text-red-600">
                      {commentErrors.content.message}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmittingComment}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmittingComment ? "Enviando..." : "Comentar"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Activity Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-blue-600" />
              {selectedActivity && getActivityTitle(selectedActivity)}
            </DialogTitle>
            <DialogDescription>
              {selectedActivity && (
                <>
                  Por {selectedActivity.user?.name || "Usuário"} •{" "}
                  {format(new Date(selectedActivity.createdAt), "PPP 'às' p", {
                    locale: ptBR,
                  })}
                </>
              )}
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

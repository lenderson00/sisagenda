"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { AppointmentActivity, User } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle, Paperclip, Send } from "lucide-react";
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

const getActivityTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    COMMENT: "Comentário",
    CREATED: "Criado",
    UPDATED: "Atualizado",
    CANCELLED: "Cancelamento Solicitado",
    RESCHEDULE_REQUESTED: "Reagendamento Solicitado",
    RESCHEDULE_CONFIRMED: "Reagendamento Confirmado",
    RESCHEDULE_REJECTED: "Reagendamento Rejeitado",
    STATUS_CHANGE: "Status Alterado",
  };
  return labels[type] || type;
};

const getActivityTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    COMMENT: "bg-blue-100 text-blue-800",
    CREATED: "bg-green-100 text-green-800",
    UPDATED: "bg-yellow-100 text-yellow-800",
    CANCELLED: "bg-red-100 text-red-800",
    RESCHEDULE_REQUESTED: "bg-orange-100 text-orange-800",
    RESCHEDULE_CONFIRMED: "bg-green-100 text-green-800",
    RESCHEDULE_REJECTED: "bg-red-100 text-red-800",
    STATUS_CHANGE: "bg-purple-100 text-purple-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
};

export function AppointmentActivityList({
  appointmentId,
  initialActivities,
  currentUser,
}: AppointmentActivityListProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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

      const newActivity = await response.json();
      setActivities((prev) => [newActivity, ...prev]);
      resetCommentForm();
      toast.success("Comentário adicionado com sucesso!");
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error("Erro ao adicionar comentário");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          Atividades e Comentários
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Comment Form */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <form onSubmit={handleSubmitComment(onCommentSubmit)}>
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-500 text-white">
                  {currentUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Adicione um comentário sobre este agendamento..."
                  className="min-h-[80px] bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  {...registerComment("content", {
                    required: "O comentário não pode estar vazio",
                  })}
                />
                {commentErrors.content && (
                  <p className="text-sm text-red-600">
                    {commentErrors.content.message}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Anexar Arquivo
                  </Button>
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

        {/* Activities Timeline */}
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhuma atividade registrada ainda.</p>
              <p className="text-sm">Seja o primeiro a comentar!</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex gap-4 p-4 rounded-lg border ${
                  activity.type === "COMMENT"
                    ? "bg-white border-gray-200"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.user.image || undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {activity.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {activity.user.name}
                      </p>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getActivityTypeColor(activity.type)}`}
                      >
                        {getActivityTypeLabel(activity.type)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {format(new Date(activity.createdAt), "PPp", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {activity.content}
                  </div>
                  {index < activities.length - 1 && (
                    <div className="mt-4 border-b border-gray-200" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

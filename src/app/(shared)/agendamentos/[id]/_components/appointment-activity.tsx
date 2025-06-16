"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
import { AppointmentActivityItem } from "./appointment-activity-item";
import { useSession } from "next-auth/react";

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

export function AppointmentActivityList({
  appointmentId,
  initialActivities,
  currentUser,
}: AppointmentActivityListProps) {
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
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

  return (
    <div className="space-y-4">
      <div>
        <div>
          <div className="text-xl flex items-center gap-2">Atividades</div>
        </div>
        <div>
          {/* Activities Timeline */}
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhuma atividade registrada ainda.</p>
                <p className="text-sm">Seja o primeiro a comentar!</p>
              </div>
            ) : (
              activities.map((activity) => (
                <AppointmentActivityItem
                  key={activity.id}
                  activity={activity}
                />
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
        </div>
      </div>
    </div>
  );
}

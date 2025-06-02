"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { AppointmentActivity, User } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle, Paperclip } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Atividades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.image || undefined} />
                <AvatarFallback>
                  {activity.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(activity.createdAt), "Pp", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <p className="text-sm text-gray-600">{activity.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmitComment(onCommentSubmit)} className="mt-6">
          <div className="flex gap-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {currentUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Adicione um comentário..."
                className="min-h-[100px]"
                {...registerComment("content", {
                  required: "O comentário não pode estar vazio",
                })}
              />
              {commentErrors.content && (
                <p className="text-sm text-red-500">
                  {commentErrors.content.message}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-gray-500"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Anexar
                </Button>
                <Button type="submit" size="sm" disabled={isSubmittingComment}>
                  {isSubmittingComment ? "Enviando..." : "Comentar"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

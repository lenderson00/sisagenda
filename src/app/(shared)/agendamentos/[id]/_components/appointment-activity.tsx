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
  Loader2,
  MessageCircle,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AppointmentActivityItem } from "./appointment-activity-item";
import { useSession } from "next-auth/react";
import { IconArrowUp } from "@tabler/icons-react";

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

  useEffect(() => {
    if (commentErrors.content) {
      toast.error(commentErrors.content.message);
    }
  }, [commentErrors]);

  return (
    <div className="space-y-4">
      <div>
        <div>
          <div className="text-xl flex items-center gap-2">Atividades</div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="space-y-3 my-2">
            {activities.length !== 0 &&
              activities
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime(),
                )
                .map((activity) => (
                  <AppointmentActivityItem
                    key={activity.id}
                    activity={activity}
                  />
                ))}
          </div>

          {/* Comment Form */}
          <div className=" relative">
            <form onSubmit={handleSubmitComment(onCommentSubmit)}>
              <div className="flex gap-3">
                <div className="flex-1  bg-background">
                  <Textarea
                    placeholder="Deixe um comentário..."
                    className="min-h-[80px] p-4 resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...registerComment("content", {
                      required: "O comentário não pode estar vazio",
                    })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onCommentSubmit({ content: e.currentTarget.value });
                      }
                    }}
                  />

                  <div className="flex justify-end absolute bottom-2 right-2">
                    <Button
                      type="submit"
                      disabled={isSubmittingComment}
                      className="border rounded-full bg-background size-8 hover:bg-accent"
                    >
                      {isSubmittingComment ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <IconArrowUp className="size-4 text-foreground" />
                      )}
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

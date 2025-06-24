"use client";

import type { AppointmentActivity, User } from "@prisma/client";
import {
  Activity,
  Check,
  CheckCheck,
  Clock,
  MessageSquare,
  Pencil,
  Plus,
  SignalHigh,
  X,
} from "lucide-react";
import { TimelineItem } from "./_activity-item/timeline-item";

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
      return "comentou:";
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

export function AppointmentActivityItem({
  activity,
  isLast,
}: {
  activity: AppointmentActivity & {
    user: User;
  };
  isLast?: boolean;
}) {
  const activityDescription = getActivityDescription(activity);

  switch (activity.type) {
    case "COMMENT":
      return (
        <TimelineItem
          activity={activity}
          isLast={isLast}
          icon={<MessageSquare className="size-4" />}
        >
          {activityDescription}{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            "{activity.content || activity.title}"
          </span>
        </TimelineItem>
      );
    case "CREATED":
      return (
        <TimelineItem
          activity={activity}
          isLast={isLast}
          icon={<Plus className="size-4" />}
        >
          {activityDescription}
        </TimelineItem>
      );
    case "UPDATED":
      return (
        <TimelineItem
          activity={activity}
          isLast={isLast}
          icon={<Pencil className="size-4" />}
        >
          {activityDescription}
        </TimelineItem>
      );
    case "CANCELLED":
      return (
        <TimelineItem
          activity={activity}
          isLast={isLast}
          icon={<X className="size-4" />}
        >
          {activityDescription}
        </TimelineItem>
      );
    case "COMPLETED":
      return (
        <TimelineItem
          activity={activity}
          isLast={isLast}
          icon={<CheckCheck className="size-4" />}
        >
          {activityDescription}
        </TimelineItem>
      );
    case "RESCHEDULE_REQUESTED":
      return (
        <TimelineItem
          activity={activity}
          isLast={isLast}
          icon={<Clock className="size-4" />}
        >
          {activityDescription}
        </TimelineItem>
      );
    case "RESCHEDULE_CONFIRMED":
      return (
        <TimelineItem
          activity={activity}
          isLast={isLast}
          icon={<Check className="size-4" />}
        >
          {activityDescription}
        </TimelineItem>
      );
    case "RESCHEDULE_REJECTED":
      return (
        <TimelineItem
          activity={activity}
          isLast={isLast}
          icon={<X className="size-4" />}
        >
          {activityDescription}
        </TimelineItem>
      );
    case "STATUS_CHANGE":
      return (
        <TimelineItem
          activity={activity}
          isLast={isLast}
          icon={<SignalHigh className="size-4" />}
        >
          {activityDescription}
        </TimelineItem>
      );
    default:
      return (
        <TimelineItem
          activity={activity}
          isLast={isLast}
          icon={<Activity className="size-4" />}
        >
          {activityDescription}
        </TimelineItem>
      );
  }
}

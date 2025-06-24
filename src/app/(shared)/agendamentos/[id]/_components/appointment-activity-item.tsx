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
import { Comment } from "./_activity-item/comment";
import { getStatusReadableName } from "@/lib/utils";

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
      return (
        <div className="text-sm text-muted-foreground inline-flex items-center gap-1">
          alterou o status{" "}
          <span className="font-bold text-foreground">
            {getStatusReadableName(activity.previousStatus || "")}
          </span>{" "}
          para{" "}
          <span className="font-bold text-foreground">
            {getStatusReadableName(activity.newStatus || "")}
          </span>
        </div>
      );
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
  isFirst,
}: {
  activity: AppointmentActivity & {
    user: User;
  };
  isLast?: boolean;
  isFirst?: boolean;
}) {
  const activityDescription = getActivityDescription(activity);

  console.log(activity.type, isLast, isFirst);

  switch (activity.type) {
    case "COMMENT":
      return <Comment activity={activity} isLast={isLast} />;
    case "CREATED":
      return (
        <TimelineItem
          activity={activity}
          isLast={isLast}
          isFirst={isFirst}
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
          isFirst={isFirst}
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
          isFirst={isFirst}
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
          isFirst={isFirst}
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
          isFirst={isFirst}
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
          isFirst={isFirst}
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
          isFirst={isFirst}
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
          isFirst={isFirst}
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
          isFirst={isFirst}
          icon={<Activity className="size-4" />}
        >
          {activityDescription}
        </TimelineItem>
      );
  }
}

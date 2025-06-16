import type { AppointmentActivity, User } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function AppointmentActivityItem({
  activity,
}: {
  activity: AppointmentActivity & {
    user: User;
  };
}) {
  const getActivityDescription = (activity: AppointmentActivity) => {
    switch (activity.type) {
      case "ACTIVITY_COMMENT":
        return activity.comment;
      case "ACTIVITY_STATUS_CHANGE":
        return `Status alterado para ${activity.status}`;
      case "APPOINTMENT_CREATED":
        return "Agendamento criado";
      case "APPOINTMENT_UPDATED":
        return "Agendamento atualizado";
      case "APPOINTMENT_DELETED":
        return "Agendamento deletado";
      default:
        return "Atividade desconhecida";
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 leading-relaxed">
          <span className="font-medium text-gray-900">
            {activity.user.name}
          </span>{" "}
          <button
            type="button"
            // onClick={() => handleActivityClick(activity)}
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
  );
}

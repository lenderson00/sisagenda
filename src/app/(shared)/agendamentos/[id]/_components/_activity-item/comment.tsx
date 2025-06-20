import type { AppointmentActivity, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function Comment({
  activity,
}: {
  activity: AppointmentActivity & {
    user: User;
  };
}) {
  return (
    <div className="flex items-start gap-3 bg-background rounded-md border">
      <div className="flex-1 min-w-0 flex gap-2 flex-col p-4">
        <p className="text-sm">
          <span className="font-medium text-gray-900 ">
            {activity.user.name}
          </span>{" "}
          <span className="text-gray-500 ml-2">
            {formatDistanceToNow(new Date(activity.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {activity.content}
        </p>
      </div>
    </div>
  );
}

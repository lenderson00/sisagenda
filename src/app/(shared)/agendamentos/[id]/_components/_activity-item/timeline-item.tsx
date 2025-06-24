import type { AppointmentActivity, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ReactNode } from "react";

export function TimelineItem({
  activity,
  icon,
  children,
  isLast,
}: {
  activity: AppointmentActivity & {
    user: User;
  };
  icon: ReactNode;
  children: ReactNode;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex-shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {icon}
          </span>
        </div>
        {!isLast && (
          <div className="h-full w-px bg-gray-200 dark:bg-gray-700" />
        )}
      </div>
      <div className="min-w-0 flex-1 py-1.5">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-white">
            {activity.user.name}
          </span>{" "}
          {children}
          <span className="whitespace-nowrap">
            {" "}
            ·{" "}
            {formatDistanceToNow(new Date(activity.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

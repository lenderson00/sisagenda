import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AppointmentActivity, User } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
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
  const isSystem = activity.content?.includes("sistema");
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center justify-center">
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
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-bold text-gray-900 dark:text-white">
            {isSystem ? "Sistema" : activity.user.name}
          </span>{" "}
          {children}
          <span className="whitespace-nowrap">
            {" "}
            ·{" "}
            <Tooltip>
              <TooltipTrigger>
                {formatDistanceToNow(new Date(activity.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </TooltipTrigger>
              <TooltipContent sideOffset={-5}>
                {dayjs(activity.createdAt).format("DD MMMM YYYY - HH:mm")}
              </TooltipContent>
            </Tooltip>
          </span>
        </div>
      </div>
    </div>
  );
}

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
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
  isFirst,
}: {
  activity: AppointmentActivity & {
    user: User;
  };
  icon: ReactNode;
  children: ReactNode;
  isLast?: boolean;
  isFirst?: boolean;
}) {
  const isSystem = activity.content?.includes("sistema");
  return (
    <div className="flex items-stretch gap-2 relative ml-4 py-2">
      <div
        className={cn(
          "bg-neutral-400 dark:bg-neutral-600 w-0.5 h-full  absolute left-0  top-0 bottom-0 ",
          isFirst && "top-1/2",
          isLast && "bottom-2",
        )}
      />
      <div className="flex -ml-[19px] items-center">
        <div className="flex flex-col items-center">
          <div className="flex-shrink-0 relative">
            <div className="flex size-10 p-2 relative bg-background border-4 border-accent items-center justify-center rounded-full text-accent-foreground">
              <div className="flex items-center justify-center size-full">
                {icon}
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 py-1.5">
          <div className="text-sm ">
            <span className="font-bold ">
              {isSystem ? "Sistema" : activity.user.name}
            </span>{" "}
            {children}
            <span className="whitespace-nowrap">
              {" "}
              ·{" "}
              <Tooltip>
                <TooltipTrigger className="text-xs text-muted-foreground">
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
    </div>
  );
}

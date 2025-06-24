import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import type { AppointmentActivity, User } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function Comment({
  activity,
  isLast,
}: {
  activity: AppointmentActivity & {
    user: User;
  };
  isLast?: boolean;
}) {
  return (
    <div className="relative py-2">
      <div
        className={cn(
          "bg-neutral-400 dark:bg-neutral-600 w-0.5   absolute left-[16px]  -top-1 -bottom-1 ",
          isLast && "h-1/2",
        )}
      />
      <div className="flex items-start gap-3 bg-background rounded-md border relative ">
        <div className="flex-1 min-w-0 flex gap-2 flex-col p-4 relative">
          <p className="text-sm">
            <span className="font-medium text-gray-900 ">
              {activity.user.name}
            </span>{" "}
            <span className="text-gray-500 ml-2">
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-xs">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </TooltipTrigger>
                <TooltipContent sideOffset={-5}>
                  {dayjs(activity.createdAt).format("DD MMMM YYYY - HH:mm")}
                </TooltipContent>
              </Tooltip>
            </span>
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {activity.content}
          </p>
        </div>
      </div>
    </div>
  );
}

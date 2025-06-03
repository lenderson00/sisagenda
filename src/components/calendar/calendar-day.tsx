"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type dayjs from "dayjs";
import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface CalendarDayProps {
  date: dayjs.Dayjs;
  disabled: boolean;
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: (date: dayjs.Dayjs) => void;
}

export function CalendarDay({
  date,
  disabled,
  isSelected,
  isToday,
  isCurrentMonth,
  onClick,
}: CalendarDayProps) {
  const isAvailable = !disabled && isCurrentMonth;
  const formattedDate = date.format("DD/MM/YYYY");

  const getTooltipContent = () => {
    if (!isCurrentMonth) {
      return {
        icon: <Clock className="w-4 h-4 mr-2" />,
        text: "Fora do mês atual",
        textColor: "text-neutral-400",
      };
    }

    if (isAvailable) {
      return {
        icon: <CheckCircle className="w-4 h-4 mr-2 text-green-500" />,
        text: "Data disponível",
        textColor: "text-green-700",
      };
    }

    return {
      icon: <XCircle className="w-4 h-4 mr-2 text-red-500" />,
      text: "Data indisponível",
      textColor: "text-red-700",
    };
  };

  const { icon, text, textColor } = getTooltipContent();

  return (
    <Tooltip delayDuration={1500}>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full flex items-center justify-center"
        >
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "w-9 h-9 p-0 text-center rounded-md text-sm font-medium transition-all duration-200",
              "hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-sky-500",
              // Current month days
              isCurrentMonth &&
                !disabled &&
                "text-neutral-900 hover:bg-neutral-200",
              // Previous/next month days (faded)
              !isCurrentMonth && "text-neutral-400 hover:bg-neutral-50",
              // Disabled days
              disabled &&
                "text-neutral-500 cursor-default hover:bg-transparent",
              // Selected day
              isSelected &&
                !disabled &&
                "bg-neutral-800 text-white hover:bg-neutral-900 hover:text-white hover:opacity/80",
              // Today highlight
              isToday &&
                !disabled &&
                !isSelected &&
                "bg-neutral-200 hover:bg-neutral-300 font-semibold",
            )}
            onClick={() => !disabled && onClick(date)}
            disabled={disabled}
            aria-label={
              disabled
                ? `Data ${formattedDate} indisponível`
                : `Selecionar data ${formattedDate}`
            }
          >
            <motion.span whileHover={!disabled ? { opacity: 0.85 } : {}}>
              {date.get("date")}
            </motion.span>
          </Button>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        className="bg-white border border-neutral-200 shadow-md"
        sideOffset={5}
      >
        <div className="flex flex-col items-center">
          <p className="text-xs text-neutral-500 mb-1">{formattedDate}</p>
          <div className={cn("flex items-center font-medium", textColor)}>
            {icon}
            <span>{text}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

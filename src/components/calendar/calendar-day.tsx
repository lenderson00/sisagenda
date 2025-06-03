"use client";

import { motion } from "framer-motion";
import type dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, XCircle, Clock } from "lucide-react";

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
        textColor: "text-slate-400",
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
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: Math.random() * 0.1 }}
          className="w-full h-full flex items-center justify-center"
        >
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "w-9 h-9 p-0 text-center rounded-md text-sm font-medium transition-all duration-200",
              "hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-sky-500",
              // Current month days
              isCurrentMonth &&
                !disabled &&
                "text-slate-900 hover:bg-slate-100",
              // Previous/next month days (faded)
              !isCurrentMonth && "text-slate-400 hover:bg-slate-50",
              // Disabled days
              disabled && "text-slate-300 cursor-default hover:bg-transparent",
              // Selected day
              isSelected &&
                !disabled &&
                "bg-sky-500 text-white hover:bg-sky-600",
              // Today highlight
              isToday &&
                !disabled &&
                !isSelected &&
                "bg-slate-200 font-semibold",
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
        className="bg-white border border-slate-200 shadow-md"
        sideOffset={5}
      >
        <div className="flex flex-col items-center">
          <p className="text-xs text-slate-500 mb-1">{formattedDate}</p>
          <div className={cn("flex items-center font-medium", textColor)}>
            {icon}
            <span>{text}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

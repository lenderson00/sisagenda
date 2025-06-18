"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CalendarOff,
  CalendarX,
  Clock,
  MessageSquare,
  Repeat,
  Trash2,
} from "lucide-react";
import { weekDayOptions, weekOfMonthOptions } from "./constants";
import type { AvailabilityExceptionRule } from "./types";
import { minutesToTime } from "./utils";

interface RuleCardProps {
  rule: AvailabilityExceptionRule;
  index: number;
  onEdit: () => void;
}

export function RuleCard({ rule, index, onEdit }: RuleCardProps) {
  const getRuleDisplay = () => {
    const isRecurring = rule.recurrence === "RECURRING";
    const recurrenceText = isRecurring ? "Recorrente" : "Uma vez";

    switch (rule.type) {
      case "BLOCK_WHOLE_DAY":
        return {
          title: "Dia Inteiro Bloqueado",
          details: rule.date
            ? `Data: ${dayjs(rule.date).format("DD/MM/YYYY")}`
            : `${weekDayOptions[rule.weekDay || 0].label}${
                rule.weekOfMonth
                  ? ` (${weekOfMonthOptions.find((w) => w.value === rule.weekOfMonth)?.label})`
                  : ""
              }`,
          icon: Calendar,
          color: "bg-red-50 border-red-200",
          recurrence: recurrenceText,
          comment: rule.comment,
        };

      case "BLOCK_TIME_RANGE": {
        const timeRange = `${minutesToTime(rule.startTime)} - ${minutesToTime(rule.endTime)}`;
        return {
          title: "Período de Horário Bloqueado",
          details: rule.date
            ? `${dayjs(rule.date).format("DD/MM/YYYY")} • ${timeRange}`
            : `${weekDayOptions[rule.weekDay || 0].label} • ${timeRange}${
                rule.weekOfMonth
                  ? ` (${weekOfMonthOptions.find((w) => w.value === rule.weekOfMonth)?.label})`
                  : ""
              }`,
          icon: Clock,
          color: "bg-orange-50 border-orange-200",
          recurrence: recurrenceText,
          comment: rule.comment,
        };
      }

      case "BLOCK_SPECIFIC_WEEK_DAYS": {
        const selectedDays = rule.weekDays
          .map((day) => weekDayOptions[day].short)
          .join(", ");
        return {
          title: "Dias Específicos da Semana Bloqueados",
          details: `Dias: ${selectedDays}`,
          icon: CalendarDays,
          color: "bg-blue-50 border-blue-200",
          recurrence: recurrenceText,
          comment: rule.comment,
        };
      }

      default:
        return {
          title: "Regra Desconhecida",
          details: "",
          icon: AlertCircle,
          color: "bg-gray-50 border-gray-200",
          recurrence: "Desconhecido",
          comment: "",
        };
    }
  };

  const {
    title,
    details,
    icon: Icon,
    color,
    recurrence,
    comment,
  } = getRuleDisplay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn("transition-all cursor-pointer", color)}
        onClick={onEdit}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2 flex-1">
              <div className="p-1.5 rounded-lg bg-white/50">
                <Icon className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-xs mb-1">{title}</h4>
                <p className="text-xs text-slate-600 break-words mb-1">
                  {details}
                </p>

                {/* Comment Display */}
                <div className="bg-white/70 p-1.5 rounded border border-slate-200 mb-1">
                  <div className="flex items-start gap-1">
                    <MessageSquare className="w-2.5 h-2.5 text-slate-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-700 italic break-words">
                      {comment}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs h-5">
                    #{index + 1}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs h-5",
                      recurrence === "Recorrente"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-teal-50 text-teal-700 border-teal-200",
                    )}
                  >
                    {recurrence === "Recorrente" ? (
                      <Repeat className="w-2.5 h-2.5 mr-1" />
                    ) : (
                      <CalendarX className="w-2.5 h-2.5 mr-1" />
                    )}
                    {recurrence}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

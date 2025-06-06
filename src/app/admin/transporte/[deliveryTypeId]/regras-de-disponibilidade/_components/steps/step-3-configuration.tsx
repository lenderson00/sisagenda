"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CalendarOff,
  CalendarX,
  Repeat,
} from "lucide-react";
import {
  ruleTypeOptions,
  weekDayOptions,
  weekOfMonthOptions,
} from "../constants";
import { StepTitle } from "../step-title";
import type { WeekOfMonth } from "../types";
import { timeToMinutes } from "../utils";

interface Step3ConfigurationProps {
  ruleType: string;
  recurrenceType: string;
  useSpecificDate: boolean;
  dateValue: string;
  weekDayValue: number;
  weekOfMonthValue: WeekOfMonth | "";
  startTimeValue: string;
  endTimeValue: string;
  specificWeekDays: number[];
  onUseSpecificDateChange: (value: boolean) => void;
  onDateValueChange: (value: string) => void;
  onWeekDayValueChange: (value: number) => void;
  onWeekOfMonthValueChange: (value: WeekOfMonth | "") => void;
  onStartTimeValueChange: (value: string) => void;
  onEndTimeValueChange: (value: string) => void;
  onSpecificWeekDaysChange: (days: number[]) => void;
}

export function Step3Configuration({
  ruleType,
  recurrenceType,
  useSpecificDate,
  dateValue,
  weekDayValue,
  weekOfMonthValue,
  startTimeValue,
  endTimeValue,
  specificWeekDays,
  onUseSpecificDateChange,
  onDateValueChange,
  onWeekDayValueChange,
  onWeekOfMonthValueChange,
  onStartTimeValueChange,
  onEndTimeValueChange,
  onSpecificWeekDaysChange,
}: Step3ConfigurationProps) {
  const selectedRuleType = ruleTypeOptions.find(
    (option) => option.value === ruleType,
  );

  const handleWeekDayToggle = (day: number) => {
    if (specificWeekDays.includes(day)) {
      onSpecificWeekDaysChange(specificWeekDays.filter((d) => d !== day));
    } else {
      onSpecificWeekDaysChange([...specificWeekDays, day]);
    }
  };

  return (
    <>
      <StepTitle
        title="Configure os Detalhes"
        description={`Configure os parâmetros específicos para ${selectedRuleType?.label.toLowerCase()}`}
      />
      <div className="space-y-5">
        {/* Configuration for BLOCK_ENTIRE_WEEK */}
        {ruleType === "BLOCK_ENTIRE_WEEK" && (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-indigo-100 flex items-center justify-center">
              <CalendarOff className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="font-medium text-slate-900 text-base mb-2">
              Bloqueio de Semana Inteira
            </h3>
            <p className="text-sm text-slate-600">
              Esta regra bloqueará todos os dias da semana{" "}
              {recurrenceType === "RECURRING"
                ? "de forma recorrente"
                : "uma única vez"}
              .
            </p>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 justify-center">
                <Badge
                  variant="outline"
                  className={cn(
                    recurrenceType === "RECURRING"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-teal-50 text-teal-700 border-teal-200",
                  )}
                >
                  {recurrenceType === "RECURRING" ? (
                    <Repeat className="w-3 h-3 mr-1" />
                  ) : (
                    <CalendarX className="w-3 h-3 mr-1" />
                  )}
                  {recurrenceType === "RECURRING" ? "Recorrente" : "Uma vez"}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Common fields for BLOCK_WHOLE_DAY and BLOCK_TIME_RANGE */}
        {(ruleType === "BLOCK_WHOLE_DAY" ||
          ruleType === "BLOCK_TIME_RANGE") && (
          <div className="space-y-5">
            {/* Date Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">
                Tipo de Data
              </Label>
              <div className="grid grid-cols-1 gap-2">
                <motion.div
                  className={cn(
                    "p-3 rounded-lg border-2 cursor-pointer transition-all",
                    useSpecificDate
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 hover:border-slate-300 bg-white",
                  )}
                  onClick={() => onUseSpecificDateChange(true)}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium text-sm">Data Específica</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Bloquear uma data pontual
                  </p>
                </motion.div>
                <motion.div
                  className={cn(
                    "p-3 rounded-lg border-2 cursor-pointer transition-all",
                    !useSpecificDate
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 hover:border-slate-300 bg-white",
                  )}
                  onClick={() => onUseSpecificDateChange(false)}
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <span className="font-medium text-sm">Dia da Semana</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Bloquear dias da semana
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Date/WeekDay Fields */}
            {useSpecificDate ? (
              <div className="space-y-2">
                <Label
                  htmlFor="date"
                  className="text-sm font-medium text-slate-700"
                >
                  Data *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={dateValue}
                  onChange={(e) => onDateValueChange(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="weekDay"
                    className="text-sm font-medium text-slate-700"
                  >
                    Dia da Semana *
                  </Label>
                  <Select
                    value={weekDayValue.toString()}
                    onValueChange={(value) =>
                      onWeekDayValueChange(Number(value))
                    }
                  >
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDayOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="weekOfMonth"
                    className="text-sm font-medium text-slate-700"
                  >
                    Semana do Mês
                  </Label>
                  <Select
                    value={weekOfMonthValue}
                    onValueChange={(value) =>
                      onWeekOfMonthValueChange(value as WeekOfMonth)
                    }
                  >
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="Todas as semanas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todas as semanas</SelectItem>
                      {weekOfMonthOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Time Range Fields */}
            {ruleType === "BLOCK_TIME_RANGE" && (
              <div className="space-y-4">
                <Separator />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="startTime"
                      className="text-sm font-medium text-slate-700"
                    >
                      Horário de Início *
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTimeValue}
                      onChange={(e) => onStartTimeValueChange(e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="endTime"
                      className="text-sm font-medium text-slate-700"
                    >
                      Horário de Fim *
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTimeValue}
                      onChange={(e) => onEndTimeValueChange(e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>
                </div>
                {timeToMinutes(startTimeValue) >=
                  timeToMinutes(endTimeValue) && (
                  <div className="flex items-center gap-2 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>
                      O horário de fim deve ser posterior ao horário de início
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Specific Week Days */}
        {ruleType === "BLOCK_SPECIFIC_WEEK_DAYS" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Dias da Semana para Bloquear *
              </Label>
              <p className="text-xs text-slate-600">
                Selecione os dias da semana que deseja bloquear
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {weekDayOptions.map((day) => (
                <motion.button
                  key={day.value}
                  type="button"
                  onClick={() => handleWeekDayToggle(day.value)}
                  className={cn(
                    "p-2 rounded-lg border-2 transition-all text-center",
                    specificWeekDays.includes(day.value)
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700",
                  )}
                >
                  <div className="font-medium text-xs">{day.short}</div>
                  <div className="text-xs opacity-75">
                    {day.label.split("-")[0]}
                  </div>
                </motion.button>
              ))}
            </div>
            {specificWeekDays.length === 0 && (
              <div className="flex items-center gap-2 text-amber-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>Selecione pelo menos um dia da semana</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

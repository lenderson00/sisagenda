import {
  Calendar,
  CalendarDays,
  CalendarOff,
  CalendarX,
  Clock,
  Repeat,
} from "lucide-react";
import { WeekOfMonth } from "./types";

export const ruleTypeOptions = [
  {
    value: "BLOCK_WHOLE_DAY",
    label: "Bloquear Dia Inteiro",
    description: "Bloqueia um dia específico ou recorrente",
    icon: Calendar,
    color: "bg-red-50 border-red-200 text-red-700",
  },
  {
    value: "BLOCK_TIME_RANGE",
    label: "Bloquear Período de Horário",
    description: "Bloqueia um horário específico em determinados dias",
    icon: Clock,
    color: "bg-orange-50 border-orange-200 text-orange-700",
  },
  {
    value: "BLOCK_SPECIFIC_WEEK_DAYS",
    label: "Bloquear Dias Específicos da Semana",
    description:
      "Bloqueia dias específicos de uma semana (ex: todas as Segundas)",
    icon: CalendarDays,
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
];

export const weekDayOptions = [
  { value: 0, label: "Domingo", short: "Dom" },
  { value: 1, label: "Segunda-feira", short: "Seg" },
  { value: 2, label: "Terça-feira", short: "Ter" },
  { value: 3, label: "Quarta-feira", short: "Qua" },
  { value: 4, label: "Quinta-feira", short: "Qui" },
  { value: 5, label: "Sexta-feira", short: "Sex" },
  { value: 6, label: "Sábado", short: "Sáb" },
];

export const weekOfMonthOptions = [
  { value: "FIRST", label: "Primeira semana" },
  { value: "LAST", label: "Última semana" },
];

export const recurrenceOptions = [
  {
    value: "ONE_TIME",
    label: "Uma vez",
    description:
      "Aplica-se apenas à ocorrência atual (ex: esta data, esta semana)",
    icon: CalendarX,
  },
  {
    value: "RECURRING",
    label: "Recorrente",
    description:
      "Aplica-se à ocorrência atual e todas as futuras (ex: toda Segunda, toda semana)",
    icon: Repeat,
  },
];

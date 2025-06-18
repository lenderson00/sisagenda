export type WeekOfMonth = "FIRST" | "LAST";
export type RecurrenceType = "ONE_TIME" | "RECURRING";

export interface BlockWholeDayRule {
  type: "BLOCK_WHOLE_DAY";
  date?: string; // "YYYY-MM-DD"
  weekDay?: number; // 0=domingo…6=sábado
  weekOfMonth?: WeekOfMonth;
  recurrence: RecurrenceType;
  comment: string;
}

export interface BlockTimeRangeRule {
  type: "BLOCK_TIME_RANGE";
  date?: string;
  weekDay?: number;
  weekOfMonth?: WeekOfMonth;
  startTime: number; // minutos desde 00:00
  endTime: number; // minutos desde 00:00
  recurrence: RecurrenceType;
  comment: string;
}

export interface BlockSpecificWeekDaysRule {
  type: "BLOCK_SPECIFIC_WEEK_DAYS";
  weekDays: number[]; // array de 0…6
  recurrence: RecurrenceType;
  comment: string;
}

export type AvailabilityExceptionRule =
  | BlockWholeDayRule
  | BlockTimeRangeRule
  | BlockSpecificWeekDaysRule;

export interface RulesSidebarProps {
  open: boolean;
  onClose: () => void;
  editingRule?: { rule: AvailabilityExceptionRule; index: number } | null;
  rules: AvailabilityExceptionRule[];
  deliveryTypeIds: string[];
  onRuleCreated?: (
    rule: AvailabilityExceptionRule,
    deliveryTypeIds: string[],
  ) => void;
  onRulesUpdated?: (
    rules: AvailabilityExceptionRule[],
    deliveryTypeIds: string[],
  ) => void;
}

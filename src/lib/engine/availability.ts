// src/types/availability-rule.ts

export type WeekOfMonth = "FIRST" | "LAST";

/**
 * Bloqueia dia inteiro:
 *  - `date?: "YYYY-MM-DD"` → se `recurrence === "RECURRING"`, bloqueia o mesmo mês-dia todo ano.
 *  - `weekDay?: 0..6` + `weekOfMonth?` → bloqueio semanal/mensal.
 */
export interface BlockWholeDayRule {
  type: "BLOCK_WHOLE_DAY";

  /** Se presente e sem recurrence, bloqueia só naquele exato ano-mês-dia (YYYY-MM-DD).
   *  Se `recurrence === "RECURRING"`, bloqueia mesmo mês-dia todos os anos. */
  date?: string;

  /** 0=domingo … 6=sábado. Se sem `date`, pode usar `weekDay`. */
  weekDay?: number;

  /** "FIRST" ou "LAST" semana do mês, quando usar `weekDay`. */
  weekOfMonth?: WeekOfMonth;

  /** "RECURRING" faz com que `date` seja aplicado todo ano no mesmo mês-dia. */
  recurrence?: "RECURRING";
}

/**
 * Bloqueia apenas um intervalo de horas:
 *  - `date?: "YYYY-MM-DD"`, com `recurrence?` idêntico a BlockWholeDayRule.
 *  - `weekDay?: 0..6` + `weekOfMonth?` → aplica semana/mês.
 */
export interface BlockTimeRangeRule {
  type: "BLOCK_TIME_RANGE";

  /** Se presente e `recurrence === "RECURRING"`, bloqueia mesmo mês-dia todo ano. */
  date?: string;

  /** 0…6; se presente, bloqueio semanal; se `weekOfMonth` definido, aplica FIRST/LAST semana do mês. */
  weekDay?: number;

  /** "FIRST" ou "LAST" semana do mês, quando usar `weekDay`. */
  weekOfMonth?: WeekOfMonth;

  /** Horário de início (minutos desde meia-noite) */
  startTime: number;

  /** Horário de fim (minutos desde meia-noite) */
  endTime: number;

  /** Se "RECURRING", faz com que `date` se repita anualmente. */
  recurrence?: "RECURRING";
}

/**
 * Bloqueia dias específicos (ex.: [1,3] = segunda e quarta) apenas na semana atual.
 * Não aceita `recurrence`, pois a “recorrência” já é implícita para a semana corrente.
 */
export interface BlockCurrentWeekDaysRule {
  type: "BLOCK_CURRENT_WEEK_DAYS";
  weekDays: number[]; // array de 0…6
}

/** Union de todas as regras possíveis. */
export type AvailabilityExceptionRule =
  | BlockWholeDayRule
  | BlockTimeRangeRule
  | BlockCurrentWeekDaysRule;

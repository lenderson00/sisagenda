import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import type {
  AvailabilityExceptionRule,
  BlockCurrentWeekDaysRule,
  BlockTimeRangeRule,
  BlockWholeDayRule,
} from "./availability";

/**
 * Verifica se duas datas estão na mesma semana, segundo locale pt-br (semana começa na 2ª-feira).
 */
function isSameWeek(date: Date, reference: Date): boolean {
  const a = dayjs(date).locale("pt-br").startOf("week");
  const b = dayjs(reference).locale("pt-br").startOf("week");
  return a.isSame(b, "day");
}

/**
 * Retorna a “semana do mês” (1,2,3…) para uma dada data.
 * Fórmula: Math.ceil((diaDoMes + diaDaSemanaDoPrimeiroDia) / 7).
 */
function getWeekOfMonth(date: Date): number {
  const d = dayjs(date);
  const diaDoMes = d.date();
  const primeiroDiaSemana = d.startOf("month").day(); // 0..6
  return Math.ceil((diaDoMes + primeiroDiaSemana) / 7);
}

/**
 * Checa se a regra BLOCK_WHOLE_DAY se aplica àquela `date`.
 *
 * - Se rule.date existe:
 *   • Se rule.recurrence==="RECURRING": compara apenas mês-dia (ignora ano).
 *   • Caso contrário: compara full "YYYY-MM-DD".
 * - Senão, se rule.weekDay existe:
 *   • Compara date.getDay() === rule.weekDay.
 *   • Se rule.weekOfMonth existe, verifica FIRST ou LAST semana do mês.
 */
function appliesBlockWholeDay(
  rule: BlockWholeDayRule,
  date: Date
): boolean {
  // 1) Se houver rule.date
  if (rule.date) {
    if (rule.recurrence === "RECURRING") {
      const target = dayjs(rule.date, "YYYY-MM-DD");
      return (
        dayjs(date).month() === target.month() &&
        dayjs(date).date() === target.date()
      );
    }
    const isoRule = dayjs(rule.date, "YYYY-MM-DD").format("YYYY-MM-DD");
    const isoDate = dayjs(date).format("YYYY-MM-DD");
    return isoDate === isoRule;
  }

  // 2) Se rule.weekDay definido
  if (rule.weekDay !== undefined) {
    if (date.getDay() !== rule.weekDay) {
      return false;
    }
    // Se houver weekOfMonth, verifica FIRST ou LAST semana
    if (rule.weekOfMonth) {
      const wom = getWeekOfMonth(date);
      if (rule.weekOfMonth === "FIRST") {
        return wom === 1;
      }
      if (rule.weekOfMonth === "LAST") {
        const d = dayjs(date);
        const lastDayNumber = d.endOf("month").date();
        const womLast = getWeekOfMonth(d.date(lastDayNumber).toDate());
        return wom === womLast;
      }
      return false;
    }
    // Se não tiver weekOfMonth, basta que weekday bata
    return true;
  }

  // Caso não tenha nem date nem weekDay, não se aplica
  return false;
}

/**
 * Checa se a regra BLOCK_TIME_RANGE se aplica àquela `date`.
 *
 * - Se rule.date existe:
 *   • Se rule.recurrence==="RECURRING": compara apenas mês-dia.
 *   • Senão: compara full "YYYY-MM-DD".
 * - Caso contrário, usa rule.weekDay + rule.weekOfMonth, como acima.
 */
function appliesBlockTimeRange(
  rule: BlockTimeRangeRule,
  date: Date
): boolean {
  // 1) Se houver rule.date
  if (rule.date) {
    if (rule.recurrence === "RECURRING") {
      const target = dayjs(rule.date, "YYYY-MM-DD");
      return (
        dayjs(date).month() === target.month() &&
        dayjs(date).date() === target.date()
      );
    }
    const isoRule = dayjs(rule.date, "YYYY-MM-DD").format("YYYY-MM-DD");
    const isoDate = dayjs(date).format("YYYY-MM-DD");
    if (isoDate !== isoRule) return false;
  } else {
    // 2) Se não tiver rule.date, usa rule.weekDay
    if (rule.weekDay === undefined || date.getDay() !== rule.weekDay) {
      return false;
    }
    if (rule.weekOfMonth) {
      const wom = getWeekOfMonth(date);
      if (rule.weekOfMonth === "FIRST" && wom !== 1) return false;
      if (rule.weekOfMonth === "LAST") {
        const d = dayjs(date);
        const lastDayNumber = d.endOf("month").date();
        const womLast = getWeekOfMonth(d.date(lastDayNumber).toDate());
        if (wom !== womLast) return false;
      }
    }
  }

  return true;
}

/**
 * Checa se a regra BLOCK_CURRENT_WEEK_DAYS se aplica àquela `date`.
 * - Primeiro: se `date` está na mesma semana que hoje (seg-dom, segundo pt-br).
 * - Segundo: se date.getDay() ∈ rule.weekDays.
 */
function appliesBlockCurrentWeekDays(
  rule: BlockCurrentWeekDaysRule,
  date: Date
): boolean {
  const hoje = new Date();
  if (!isSameWeek(date, hoje)) return false;
  return rule.weekDays.includes(date.getDay());
}

/**
 * Para cada regra e data, devolve um array de intervalos {start, end} (em minutos)
 * que devem ser bloqueados naquele dia:
 * - BLOCK_WHOLE_DAY  → [{0,1440}] se appliesBlockWholeDay(rule, date)
 * - BLOCK_TIME_RANGE → [{rule.startTime, rule.endTime}] se appliesBlockTimeRange(rule, date)
 * - BLOCK_CURRENT_WEEK_DAYS → [{0,1440}] se appliesBlockCurrentWeekDays(rule, date)
 */
export function getBlockedIntervalsForDate(
  rule: AvailabilityExceptionRule,
  date: Date
): Array<{ start: number; end: number }> {
  if (rule.type === "BLOCK_WHOLE_DAY") {
    if (appliesBlockWholeDay(rule, date)) {
      return [{ start: 0, end: 24 * 60 }];
    }
    return [];
  }

  if (rule.type === "BLOCK_TIME_RANGE") {
    if (appliesBlockTimeRange(rule, date)) {
      return [{ start: rule.startTime, end: rule.endTime }];
    }
    return [];
  }

  if (rule.type === "BLOCK_CURRENT_WEEK_DAYS") {
    if (appliesBlockCurrentWeekDays(rule, date)) {
      return [{ start: 0, end: 24 * 60 }];
    }
    return [];
  }

  return [];
}

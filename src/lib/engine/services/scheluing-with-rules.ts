// src/services/scheduling-with-rules.service.ts

import { getAppointmentBlocksForDate } from "./appointment";
import { getAvailabilityByWeekday } from "./availability";
import { getRules } from "./availability-rule";

import { subtractBlocksFromFree } from "../intervals";
import { getBlockedIntervalsForDate } from "../rule";
import {
  type TimeBlock as LunchTimeBlock,
  splitByLunch,
} from "../time";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";

export interface Slot {
  start: number; // minutos desde 00:00
  end: number;   // minutos desde 00:00
}

/**
 * Retorna todos os slots possíveis para um dia exato, considerando:
 * 1) Disponibilidade semanal (Availability)
 * 2) Horário de almoço (split)
 * 3) Regras de exceção (AvailabilityRule, com recurrence)
 * 4) Appointments já agendados (Appointment)
 * 5) Encaixe de atividade de duration fixa (earliest-fit)
 *
 * @param deliveryTypeId    ID de DeliveryType
 * @param date              Date (dia exato para consulta)
 * @param activityDuration  número de minutos que cada slot deve ter
 * @param lunchStart        início do almoço (minutos desde 00:00)
 * @param lunchEnd          fim    do almoço (minutos desde 00:00)
 */
export async function getAvailableSlotsForDate({
  deliveryTypeId,
  date,
  activityDuration,
  lunchStart,
  lunchEnd,
}: {
  deliveryTypeId: string;
  date: Date;
  activityDuration: number;
  lunchStart: number;
  lunchEnd: number;
}): Promise<Slot[]> {
  // 1) Determina o weekday (0=domingo…6=sábado) usando dayjs
  const weekDay = dayjs(date).locale("pt-br").day();

  // 2) Busca Availability (horário padrão semanal)
  const availability = await getAvailabilityByWeekday(
    deliveryTypeId,
    weekDay
  );
  if (!availability) {
    // Não há Availability cadastrado para este deliveryTypeId e weekday
    return [];
  }

  // 3) Faz split do horário padrão pelo almoço
  let freeBlocks: LunchTimeBlock[] = splitByLunch(
    availability.startTime,
    availability.endTime,
    lunchStart,
    lunchEnd
  );
  // Ex.: [ { start: 540, end: 720 }, { start: 780, end: 1020 } ]

  // 4) Aplica regras de exceção (JSON em AvailabilityRule)
  const rules = await getRules(deliveryTypeId);
  if (rules && rules.length > 0) {
    const allBlocked: LunchTimeBlock[] = [];
    for (const rule of rules) {
      const intervals = getBlockedIntervalsForDate(rule, date);
      allBlocked.push(...intervals);
    }
    // 4.1) Se algum intervalo for [0,1440], bloqueio total do dia
    for (const b of allBlocked) {
      if (b.start === 0 && b.end >= 24 * 60) {
        return [];
      }
    }
    // 4.2) Subtrai esses intervalos dos freeBlocks
    freeBlocks = subtractBlocksFromFree(freeBlocks, allBlocked);
    if (freeBlocks.length === 0) return [];
  }

  // 5) Aplica bloqueios baseados em Appointments agendados no dia
  const apptBlocks = await getAppointmentBlocksForDate(
    deliveryTypeId,
    date
  );
  if (apptBlocks.length > 0) {
    freeBlocks = subtractBlocksFromFree(freeBlocks, apptBlocks);
    if (freeBlocks.length === 0) {
      return [];
    }
  }

  // 6) Para cada bloco livre restante, encaixa activityDuration (earliest-fit)
  const fits: Slot[] = [];
  for (const block of freeBlocks) {
    if (block.end - block.start >= activityDuration) {
      fits.push({ start: block.start, end: block.start + activityDuration });
    }
  }

  return fits;
}

// src/services/appointment.service.ts

import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

const prisma = new PrismaClient();

/**
 * Representa um bloco de tempo (start/end) em minutos desde 00:00.
 */
export type TimeBlock = { start: number; end: number };

/**
 * Retorna todos os blocos ocupados (TimeBlock[]) pelos Appointments
 * de um dado deliveryTypeId na data exata (ignorando horário).
 *
 * @param deliveryTypeId ID de DeliveryType
 * @param date           instância Date (dia exato para filtrar)
 */
export async function getAppointmentBlocksForDate(
  deliveryTypeId: string,
  date: Date
): Promise<TimeBlock[]> {
  // 1) Define intervalo 00:00 até 23:59:59 desse dia
  const day = dayjs(date).locale("pt-br");
  const startOfDay = day.startOf("day").toDate();
  const endOfDay = day.endOf("day").toDate();

  // 2) Busca appointments nesse intervalo para o deliveryTypeId
  const appointments = await prisma.appointment.findMany({
    where: {
      deliveryTypeId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      deletedAt: null, // ignora lógicas de exclusão (se houver)
    },
    select: {
      date: true,
      duration: true,
    },
  });

  // 3) Converte cada appointment em um TimeBlock (em minutos)
  const blocks: TimeBlock[] = appointments.map((appt) => {
    const apptStart = dayjs(appt.date).locale("pt-br");
    const minutosDesdeMeiaNoite = apptStart.hour() * 60 + apptStart.minute();
    return {
      start: minutosDesdeMeiaNoite,
      end: minutosDesdeMeiaNoite + appt.duration,
    };
  });

  return blocks;
}

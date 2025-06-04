// src/services/availability.service.ts

import { type Availability, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Busca um registro de Availability ativo para um dado deliveryTypeId e weekDay.
 * @param deliveryTypeId ID de DeliveryType
 * @param weekDay        0=domingo … 6=sábado
 * @returns Availability ou null
 */
export async function getAvailabilityByWeekday(
  deliveryTypeId: string,
  weekDay: number
): Promise<Availability | null> {
  return prisma.availability.findFirst({
    where: {
      deliveryTypeId,
      weekDay,
      deletedAt: null,
    },
  });
}

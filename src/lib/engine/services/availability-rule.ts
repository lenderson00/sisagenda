// src/services/availability-rule.service.ts

import { PrismaClient } from "@prisma/client";
import type { AvailabilityExceptionRule } from "../availability";

const prisma = new PrismaClient();

/**
 * Retorna o array de regras (AvailabilityExceptionRule[]) para um dado deliveryTypeId.
 * Se não existir, devolve null.
 */
export async function getRules(
  deliveryTypeId: string
): Promise<AvailabilityExceptionRule[] | null> {
  const row = await prisma.availabilityRule.findUnique({
    where: { deliveryTypeId },
  });
  if (!row) return null;
  return row.rule as unknown as AvailabilityExceptionRule[];
}

/**
 * Cria ou atualiza (upsert) as regras para deliveryTypeId.
 * Substitui o JSON inteiro em `rule`.
 */
export async function upsertRules(
  deliveryTypeId: string,
  rules: AvailabilityExceptionRule[]
): Promise<void> {
  await prisma.availabilityRule.upsert({
    where: { deliveryTypeId },
    create: {
      deliveryTypeId,
      rule: JSON.stringify(rules),
    },
    update: {
      rule: JSON.stringify(rules),
      updatedAt: new Date(),
    },
  });
}

/**
 * (Opcional) Remove todas as regras de um deliveryTypeId.
 */
export async function deleteRules(deliveryTypeId: string): Promise<void> {
  await prisma.availabilityRule.deleteMany({
    where: { deliveryTypeId },
  });
}

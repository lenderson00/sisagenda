import { UserRole } from "@prisma/client";
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  role: z.nativeEnum(UserRole || "all").optional(),
  isActive: z.boolean().optional(),
  whatsapp: z.string().optional(),
  organizationId: z.string().cuid().optional(),
});

export const userQuerySchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  search: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.string().cuid(),
});

export const toggleTwoFactorSchema = z.object({
  enabled: z.boolean(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type ToggleTwoFactorInput = z.infer<typeof toggleTwoFactorSchema>;

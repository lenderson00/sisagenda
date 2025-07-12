import { z } from 'zod'

export const roles = z.union([
  z.literal('SUPER_ADMIN'),
  z.literal('ADMIN'),
  z.literal('COMIMSUP_ADMIN'),
  z.literal('COMRJ_ADMIN'),
  z.literal('USER'),
  z.literal('FORNECEDOR'),
])

export type Roles = z.infer<typeof roles>

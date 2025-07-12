import { z } from 'zod'
import { roles } from '../roles'

export const authUserSchema = z.object({
  id: z.string(),
  role: roles,
  organizationId: z.string().nullable(),
})

export type AuthUser = z.infer<typeof authUserSchema>

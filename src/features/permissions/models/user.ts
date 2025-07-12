import { z } from 'zod'
import { roles } from '../roles'

export const userSchema = z.object({
  __typename: z.literal('User').default('User'),
  id: z.string(),
  role: roles,
  organizationId: z.string().nullable(),
})

export type User = z.infer<typeof userSchema>

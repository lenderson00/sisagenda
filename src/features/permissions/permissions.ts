import type { AbilityBuilder } from '@casl/ability'
import type { AppAbility } from '.'
import type { AuthUser } from './models/auth-user'
import type { Roles } from './roles'

type DefinePermissions = (
  user: AuthUser,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Roles, DefinePermissions> = {
  SUPER_ADMIN(user, { can }) {
    can('manage', 'Organization')
    can('manage', 'User', {
      role: 'ADMIN',
    })
  },

  ADMIN(user, { can }) { },
  COMIMSUP_ADMIN(user, { can }) { },
  COMRJ_ADMIN(user, { can }) { },
  USER(user, { can }) { },
  FORNECEDOR(user, { can }) { },
}

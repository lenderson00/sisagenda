import {
  createMongoAbility,
  type CreateAbility,
  type MongoAbility,
  AbilityBuilder,
} from '@casl/ability'

import type { UserSubject } from './subjects/user'
import type { AllSubject } from './subjects/all'
import { permissions } from './permissions'
import type { OrganizationSubject } from './subjects/organizations'
import type { AuthUser } from './models/auth-user'
import type { SupplierSubject } from './subjects/supplier'
import type { User } from './models/user'
import type { Organization } from './models/organization'
import type { Supplier } from './models/supplier'

type AppAbilities =
  | UserSubject
  | OrganizationSubject
  | SupplierSubject
  | AllSubject

export type AppAbility = MongoAbility<AppAbilities>

export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

type AppSubject = User | Organization | Supplier

export const defineAbilityFor = (user: AuthUser) => {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`No permissions defined for role: ${user.role}`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType: (item: AppSubject) => item.__typename,
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}

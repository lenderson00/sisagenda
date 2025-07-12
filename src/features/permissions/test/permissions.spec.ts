import { it, expect, describe } from 'vitest'
import { defineAbilityFor } from '..'
import { userFactory } from './factories/user'
import { organizationFactory } from './factories/organization'

describe('Permissions', () => {
  it('SUPER_ADMIN should be able to manage any user with ADMIN role', () => {
    const user = userFactory({ role: 'SUPER_ADMIN' })
    const ability = defineAbilityFor(user)

    const adminUser = userFactory({ role: 'ADMIN' })
    const anotherUser = userFactory({ role: 'USER' })

    expect(ability.can('manage', adminUser)).toBe(true)
    expect(ability.cannot('manage', anotherUser)).toBe(true)
  })

  it('SUPER_ADMIN should be able to manage any organization', () => {
    const user = userFactory({ role: 'SUPER_ADMIN' })
    const ability = defineAbilityFor(user)

    const organization = organizationFactory()

    expect(ability.can('manage', organization)).toBe(true)
  })
})

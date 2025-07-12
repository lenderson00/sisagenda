import type { User } from '../../models/user'

export function userFactory(override?: Partial<User>): User {
  return {
    id: '1',
    role: 'USER',
    organizationId: '1',
    __typename: 'User',
    ...override,
  }
}

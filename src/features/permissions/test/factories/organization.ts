import type { Organization } from '../../models/organization'

export function organizationFactory(
  override?: Partial<Organization>,
): Organization {
  return {
    id: '1',
    __typename: 'Organization',
    ...override,
  }
}

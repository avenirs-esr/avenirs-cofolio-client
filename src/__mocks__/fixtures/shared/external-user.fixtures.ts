import type { ExternalUserDTO } from '@/api/avenir-esr'

export const mockExternalUser: ExternalUserDTO = {
  eppn: 'alice.dupont',
  firstName: 'Alice',
  lastName: 'Dupont',
  email: 'alice.dupont@example.com',
  categories: [],
  externalId: 'alice.dupont',
  source: 'external',
  institutionIds: [],
}

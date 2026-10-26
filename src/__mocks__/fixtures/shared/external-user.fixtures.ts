import type { ExternalUserDetailDTO, ExternalUserDTO } from '@/api/avenir-esr'
import { EGroupType } from '@/api/avenir-esr'

export const mockExternalUser: ExternalUserDTO = {
  eppn: 'alice.dupont',
  firstName: 'Alice',
  lastName: 'Dupont',
  email: 'alice.dupont@example.com',
  categories: [],
  externalId: 'alice.dupont',
  source: 'external',
  institutionIds: [
    'institution-id'
  ],
}

export const mockExternalUserDetail: ExternalUserDetailDTO = {
  id: mockExternalUser.externalId!,
  firstName: mockExternalUser.firstName!,
  lastName: mockExternalUser.lastName!,
  email: mockExternalUser.email!,
  profilePictureId: undefined,
  institution: {
    id: 'institution-id',
    name: 'Institution Name'
  },
  groups: [
    {
      id: 'group-id',
      name: 'Group Name',
      type: EGroupType.PROGRAM,
    }
  ]
}

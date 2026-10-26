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

export const mockExternalUserWithoutEmail: ExternalUserDTO = {
  ...mockExternalUser,
  email: undefined,
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
    { id: 'program-1', name: 'Programme', type: EGroupType.PROGRAM },
    { id: 'option-1', name: 'Option de formation', type: EGroupType.PROGRAM_OPTION },
    { id: 'student-group-1', name: 'Groupe apprenant', type: EGroupType.STUDENT_GROUP },
  ]
}

export const mockExternalUserDetailWithoutEmail: ExternalUserDetailDTO = {
  ...mockExternalUserDetail,
  email: '',
}

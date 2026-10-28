import type { ContextualAuthorizationDTO, ExternalUserDetailDTO, ExternalUserDTO, ExternalUserGlobalAuthorizationDTO, GetExternalUserAuthorizationsParams, PagedResponseContextualAuthorizationDTO } from '@/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { EAuthorization, EAuthorizationEntityType, EGroupType, ERole, EUniverse } from '@/api/avenir-esr'

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

const staffRoles = [
  ERole.ROLE_STAFF,
  ERole.ROLE_STAFF_FEEDBACK_RESPONDER,
  ERole.ROLE_STAFF_FEEDBACK_SUPERVISOR,
  ERole.ROLE_STAFF_TRACE_REVIEWER,
  ERole.ROLE_STAFF_ACTIVITY_AUTHOR,
  ERole.ROLE_STAFF_ACTIVITY_VIEWER,
]
const staffUniverses = [EUniverse.STAFF]

export const staffUserGlobalAuthorization: ExternalUserGlobalAuthorizationDTO = {
  roles: staffRoles,
  universes: staffUniverses,
}

const studentRoles = [
  ERole.ROLE_STUDENT,
  ERole.ROLE_STUDENT_ACTIVITY,
  ERole.ROLE_STUDENT_EMPLOYMENT_KIT,
  ERole.ROLE_STUDENT_PORTFOLIO,
  ERole.ROLE_STUDENT_REFERENCE_DATA,
  ERole.ROLE_STUDENT_FEEDBACK
]
const studentUniverses = [EUniverse.STUDENT]

export const studentUserGlobalAuthorization: ExternalUserGlobalAuthorizationDTO = {
  roles: studentRoles,
  universes: studentUniverses,
}

export const fullUserGlobalAuthorization: ExternalUserGlobalAuthorizationDTO = {
  roles: [...staffRoles, ...studentRoles],
  universes: [...staffUniverses, ...studentUniverses],
}

export function getContextualAuthorizationDTO (index: number): ContextualAuthorizationDTO {
  let entityType: EAuthorizationEntityType
  let entityId: string
  let entityName: string

  const allAuthorizations: EAuthorization[] = Object.values(EAuthorization)

  if (index % 2 === 0) {
    entityType = EAuthorizationEntityType.ACTIVITY
    entityId = `ACT${index}`
    entityName = `Activité ${index}`
  }
  else {
    entityType = EAuthorizationEntityType.ACTIVITY_DRAFT
    entityId = `ACT_DRAFT${index}`
    entityName = `Brouillon d'activité ${index}`
  }

  const authorizations = allAuthorizations.slice(0, (index + 1) % allAuthorizations.length)

  return {
    entityType,
    entityId,
    entityName,
    authorizations
  }
}

export function createMockedGetExternalUserAuthorizationsResponse (
  getExternalUserAuthorizationsParams: GetExternalUserAuthorizationsParams,
  totalElements: number
): PagedResponseContextualAuthorizationDTO {
  const { page = 0, pageSize = PageSizes.FOUR, entityType } = getExternalUserAuthorizationsParams

  const mockedAuthorizations = Array.from({ length: totalElements }, (_, index) => getContextualAuthorizationDTO(index))

  let filteredAuthorizations = mockedAuthorizations

  if (entityType) {
    filteredAuthorizations = filteredAuthorizations.filter(auth => auth.entityType === entityType)
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedAuthorizations = filteredAuthorizations.slice(start, end)
  const totalPages = Math.ceil(filteredAuthorizations.length / pageSize)

  return {
    data: paginatedAuthorizations,
    page: { pageSize, totalElements: filteredAuthorizations.length, totalPages, page }
  }
}

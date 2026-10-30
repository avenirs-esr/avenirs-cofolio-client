import type {
  EUserCategory,
  ExternalUserAffiliationOverviewDTO,
  GetAffiliationsParams,
  InstitutionDTO,
  PagedResponseExternalUserAffiliationOverviewDTO,
} from '@/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { generateGroupOverviewDTOs } from '@/__mocks__/fixtures/staffs/groups.fixtures'

function getExternalUserAffiliationOverviewDTO (index: number): ExternalUserAffiliationOverviewDTO {
  const firstName = `FirstName${index}`
  const lastName = `LastName${index}`
  const email = `user${index}@example.com`
  const hasConnected = index % 2 === 0
  const profilePictureId = index % 2 === 0 ? `profilePicture${index}` : undefined
  const categories: EUserCategory[] = []
  const institutions: InstitutionDTO[] = []
  const groups = generateGroupOverviewDTOs(30)

  return {
    id: `user${index}`,
    userId: hasConnected ? `app-user${index}` : undefined,
    firstName,
    lastName,
    email,
    hasConnected,
    staff: true,
    student: false,
    profilePictureId,
    categories,
    institutions,
    groups,
  }
}

export function generateExternalUserAffiliationOverviewDTOs (count: number): ExternalUserAffiliationOverviewDTO[] {
  return Array.from({ length: count }, (_, index) => getExternalUserAffiliationOverviewDTO(index))
}

export function createMockedGetAffiliationsResponse (
  getAffiliationsParams: GetAffiliationsParams,
  totalElements: number
): PagedResponseExternalUserAffiliationOverviewDTO {
  const { keyword, page = 0, pageSize = PageSizes.FOUR, categories, groupIds, institutionIds } = getAffiliationsParams

  const mockedAffiliations = generateExternalUserAffiliationOverviewDTOs(totalElements)

  let filteredAffiliations = mockedAffiliations

  if (categories && categories.length > 0) {
    filteredAffiliations = filteredAffiliations.filter(affiliation =>
      affiliation.categories.some(category => categories.includes(category))
    )
  }

  if (groupIds && groupIds.length > 0) {
    filteredAffiliations = filteredAffiliations.filter(affiliation =>
      affiliation.groups.some(group => groupIds.includes(group.id))
    )
  }

  if (institutionIds && institutionIds.length > 0) {
    filteredAffiliations = filteredAffiliations.filter(affiliation =>
      affiliation.institutions.some(institution => institutionIds.includes(institution.id))
    )
  }

  if (keyword?.trim()) {
    filteredAffiliations = filteredAffiliations.filter(affiliation =>
      affiliation.firstName.toLowerCase().includes(keyword.toLowerCase())
      || affiliation.lastName.toLowerCase().includes(keyword.toLowerCase())
      || affiliation.email.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedAffiliations = filteredAffiliations.slice(start, end)
  const totalPages = Math.ceil(filteredAffiliations.length / pageSize)

  return {
    data: paginatedAffiliations,
    page: { pageSize, totalElements: filteredAffiliations.length, totalPages, page }
  }
}

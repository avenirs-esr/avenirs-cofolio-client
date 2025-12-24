import {
  type DeclaredProgramDetailedDTO,
  type DeclaredProgramViewDTO,
  EProgramStatus,
  type PagedResponseDeclaredProgramViewDTO
} from '@/api/avenir-esr'

export const declaredProgramViewDTOFixture: DeclaredProgramDetailedDTO = {
  id: 'declared-program-123-456-789',
  status: EProgramStatus.NOT_STARTED,
  title: 'Master en Informatique',
  description: 'Formation approfondie en développement logiciel et intelligence artificielle',
  organization: 'Université Paris-Saclay',
  result: 'Mention Très Bien',
  sourceOfInformation: 'Site web de l\'université',
  link: 'https://www.universite-paris-saclay.fr/master-informatique',
  startDate: '2023-09',
  endDate: '2025-06',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
}
export const mockedDeclaredPrograms: DeclaredProgramViewDTO[] = [
  {
    id: 'declared-program-1',
    title: 'Master en Informatique',
    result: 'Mention Très Bien',
    organization: 'Université de Paris',
    status: 'COMPLETED' as EProgramStatus
  },
  {
    id: 'declared-program-2',
    title: 'Licence Professionnelle Développement Web',
    organization: 'IUT de Lyon',
    status: 'IN_PROGRESS' as EProgramStatus
  },
  {
    id: 'declared-program-3',
    title: 'BTS Services Informatiques aux Organisations',
    result: 'Bien',
    organization: 'Lycée Technique de Marseille',
    status: 'COMPLETED' as EProgramStatus
  },
  {
    id: 'declared-program-4',
    title: 'DUT Informatique',
    organization: 'IUT de Toulouse',
    status: 'NOT_STARTED' as EProgramStatus
  },
  {
    id: 'declared-program-5',
    title: 'Formation Continue JavaScript Avancé',
    result: 'Certificat obtenu',
    organization: 'École en ligne Tech Academy',
    status: 'COMPLETED' as EProgramStatus
  }
]

export function createMockedDeclaredProgramsPagedResponse (
  pageSize: number,
  totalElements: number,
  page: number
): PagedResponseDeclaredProgramViewDTO {
  const start = page * pageSize
  const end = Math.min(start + pageSize, totalElements)
  const paginatedData = mockedDeclaredPrograms.slice(start, end)

  return {
    data: paginatedData,
    page: {
      page,
      pageSize,
      totalElements,
      totalPages: Math.ceil(totalElements / pageSize)
    }
  }
}

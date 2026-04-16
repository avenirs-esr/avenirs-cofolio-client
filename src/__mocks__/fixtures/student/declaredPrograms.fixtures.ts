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
  startDate: '2023-09',
  endDate: '2025-06',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
}

function createMockedDeclaredPrograms (count: number): DeclaredProgramViewDTO[] {
  const programs: DeclaredProgramViewDTO[] = []

  for (let i = 1; i <= count; i++) {
    programs.push({
      id: `declared-program-${i}`,
      title: `Formation déclarée ${i}`,
      organization: `Établissement ${i}`,
      status: i % 3 === 0 ? EProgramStatus.COMPLETED : i % 3 === 1 ? EProgramStatus.IN_PROGRESS : EProgramStatus.NOT_STARTED,
      result: i % 2 === 0 ? `Résultat ${i}` : undefined
    })
  }

  return programs
}

export const mockedDeclaredPrograms: DeclaredProgramViewDTO[] = createMockedDeclaredPrograms(60)

export function searchDeclaredProgramsById (
  id: string
): DeclaredProgramDetailedDTO | undefined {
  const program = mockedDeclaredPrograms.find(p => p.id === id)

  return {
    ...declaredProgramViewDTOFixture,
    id,
    status: program?.status ?? EProgramStatus.NOT_STARTED,
    title: program?.title ?? '',
    organization: program?.organization ?? '',
    result: program?.result ?? '',
  }
}

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

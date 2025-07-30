import { type AdditionalSkillDTO, type PagedResponseAdditionalSkillDTO, type PagedResponseSkillDTO, type SkillDTO, SkillLevelStatus } from '@/api/avenir-esr'

function getRandomSkillLevelStatus (): SkillLevelStatus {
  const statuses = Object.values(SkillLevelStatus)
  const randomIndex = Math.floor(Math.random() * statuses.length)
  return statuses[randomIndex]
}

export function createMockedPagedResponseSkillsDTO (pageSize: number, totalElements: number, page: number, _sort: string): PagedResponseSkillDTO {
  const mockedSkills: SkillDTO[] = []
  for (let i = 1; i <= totalElements; i++) {
    const levelCount = Math.floor(Math.random() * 4)

    const skill = {
      id: crypto.randomUUID(),
      name: `Ma super compétence ${i}`,
      traceCount: Math.floor(Math.random() * 10),
      activityCount: Math.floor(Math.random() * 10),
      levelCount,
      currentSkillLevel: {
        id: crypto.randomUUID(),
        name: `Niveau ${Math.floor(Math.random() * levelCount)}`,
        shortDescription: 'Une super description',
        status: getRandomSkillLevelStatus()
      },
      achievedSkillLevels: Math.random() < 0.5
        ? {
            id: crypto.randomUUID(),
            name: `Niveau ${Math.floor(Math.random() * levelCount)}`,
            shortDescription: 'Une super description',
            status: getRandomSkillLevelStatus()
          }
        : undefined,
      isProgramFinished: Math.random() < 0.5
    }
    mockedSkills.push(skill)
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedSkills = mockedSkills.slice(start, end)
  const totalPages = Math.ceil(totalElements / pageSize)

  return {
    data: paginatedSkills,
    page: { pageSize, totalElements, totalPages, page }
  }
}

export function createMockedPagedResponseAdditionalSkillsDTO (pageSize: number, totalElements: number, page: number, _keyword: string): PagedResponseAdditionalSkillDTO {
  const mockedSkills: AdditionalSkillDTO[] = []
  for (let i = 1; i <= totalElements; i++) {
    const skill = {
      id: crypto.randomUUID(),
      title: `Ma super compétence complémentaire ${i}`,
      pathSegments: [],
      type: 'ROME 4.0',
    }
    mockedSkills.push(skill)
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedSkills = mockedSkills.slice(start, end)
  const totalPages = Math.ceil(totalElements / pageSize)

  return {
    data: paginatedSkills,
    page: { pageSize, totalElements, totalPages, page }
  }
}

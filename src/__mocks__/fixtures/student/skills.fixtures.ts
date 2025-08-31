import {
  type AdditionalSkillDTO,
  AdditionalSkillDTOType,
  type PagedResponseAdditionalSkillDTO,
  type PagedResponseSkillDTO,
  type SkillDTO,
  SkillLevelStatus
} from '@/api/avenir-esr'

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
      type: AdditionalSkillDTOType.ROME4,
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

export function createMockedSearchAdditionalSkillsDTO (pageSize: number, totalElements: number, page: number, keyword: string): PagedResponseAdditionalSkillDTO {
  const allSkills = [
    'Accueillir des enfants',
    'Animation pédagogique',
    'Développement web',
    'Gestion de projet',
    'Formation éducative',
    'Analyse de données',
    'Design graphique',
    'Ressources humaines',
    'Logistique et transport',
    'Maintenance industrielle',
    'Sécurité et prévention des risques',
    'Innovation et recherche',
    'Leadership et management',
    'Planification stratégique',
    'Audit et contrôle interne',
    'Juridique et conformité',
    'Santé et sécurité au travail',
    'Formation et développement',
    'Relations publiques',
    'Intelligence artificielle',
    'Cybersécurité',
    'Communication client',
    'Communication interpersonnelle',
    'Communication digitale',
    'Communication marketing',
    'Communication interne',
    'Communication externe',
    'Communication de crise',
    'Communication visuelle',
    'Commerce international',
    'Commerce électronique',
    'Commerce de détail',
    'Commerce B2B',
    'Commerce en ligne',
    'Comptabilité générale',
    'Comptabilité analytique',
    'Comptabilité publique'
  ]

  const filteredSkills: AdditionalSkillDTO[] = allSkills
    .filter(title => title.toLowerCase().includes(keyword.toLowerCase()))
    .map(title => ({
      id: `search-${crypto.randomUUID()}`,
      title,
      pathSegments: ['Compétence', 'professionnelle', title.toLowerCase()],
      type: AdditionalSkillDTOType.ROME4
    }))

  const actualTotalElements = Math.min(filteredSkills.length, totalElements)
  const start = page * pageSize
  const end = start + pageSize
  const paginatedSkills = filteredSkills.slice(start, end)
  const totalPages = Math.ceil(actualTotalElements / pageSize)

  return {
    data: paginatedSkills,
    page: { pageSize, totalElements: actualTotalElements, totalPages, page }
  }
}

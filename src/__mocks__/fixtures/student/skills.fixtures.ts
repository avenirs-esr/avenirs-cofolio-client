import {
  type AdditionalSkillDTO,
  EAdditionalSkillType,
  ESkillLevelStatus,
  ETraceAssociationType,
  type PagedResponseAdditionalSkillDTO,
  type PagedResponseSkillDTO,
  type PagedResponseTraceAssociationSearchResult,
  type SkillDTO,
  type SkillListItemDTO
} from '@/api/avenir-esr'

function getRandomSkillLevelStatus (): ESkillLevelStatus {
  const statuses = Object.values(ESkillLevelStatus)
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
      levelCount,
      currentSkillLevel: {
        id: crypto.randomUUID(),
        name: `Niveau ${Math.floor(Math.random() * levelCount)}`,
        traceCount: Math.floor(Math.random() * 10),
        activityCount: Math.floor(Math.random() * 10),
        shortDescription: 'Une super description',
        status: getRandomSkillLevelStatus()
      },
      achievedSkillLevels: Math.random() < 0.5
        ? {
            id: crypto.randomUUID(),
            name: `Niveau ${Math.floor(Math.random() * levelCount)}`,
            shortDescription: 'Une super description',
            traceCount: Math.floor(Math.random() * 10),
            activityCount: Math.floor(Math.random() * 10),
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
      type: EAdditionalSkillType.ROME4,
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
      type: EAdditionalSkillType.ROME4
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

export const mockedSkillDetailed = {
  id: '1',
  name: 'Réaliser un cahier des charges fonctionnels',
  skillLevels: [
    {
      id: '1',
      name: 'Niveau 1',
    },
    {
      id: '2',
      name: 'Niveau 2',
    }
  ]
}

export const mockedStudentSkills = [
  {
    id: '1',
    title: 'Physique',
    description: 'Compétence liée aux principes et lois de la physique.',
    type: ETraceAssociationType.SKILL_LEVEL
  },
  {
    id: '2',
    title: 'Chimie',
    description: 'Compétence liée aux substances chimiques et leurs interactions.',
    type: ETraceAssociationType.SKILL_LEVEL
  },
  {
    id: '3',
    title: 'Science',
    description: 'Compétence liée à l\'étude systématique du monde naturel.',
    type: ETraceAssociationType.SKILL_LEVEL
  },
  {
    id: '4',
    title: 'Histoire',
    description: 'Compétence liée à l\'étude des événements passés.',
    type: ETraceAssociationType.SKILL_LEVEL
  },
  {
    id: '5',
    title: 'Informatique',
    description: 'Compétence liée aux technologies de l\'information et de la communication.',
    type: ETraceAssociationType.SKILL_LEVEL
  },
  {
    id: '6',
    title: 'Mathématiques',
    description: 'Compétence liée aux nombres, aux quantités et aux formes.',
    type: ETraceAssociationType.SKILL_LEVEL
  },
  {
    id: '7',
    title: 'Artistique',
    description: 'Compétence liée aux arts visuels et plastiques.',
    type: ETraceAssociationType.SKILL_LEVEL
  }
]

export function createMockedSearchStudentSkillsDTO (pageSize: number, totalElements: number, page: number, keyword: string): PagedResponseTraceAssociationSearchResult {
  const allSkills = mockedStudentSkills
  const filteredSkills = allSkills.filter(skill => skill.title.toLowerCase().includes(keyword.toLowerCase()))
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

export function createMockedAllSkillListItemDTO (): SkillListItemDTO[] {
  const mockedAllSkills: SkillListItemDTO[] = []
  for (let i = 1; i <= 20; i++) {
    const skill: SkillListItemDTO = {
      skillId: crypto.randomUUID(),
      title: `Ma super compétence complémentaire ${i}`,
    }
    mockedAllSkills.push(skill)
  }

  return mockedAllSkills
}

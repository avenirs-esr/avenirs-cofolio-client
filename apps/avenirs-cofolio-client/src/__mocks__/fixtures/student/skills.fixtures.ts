import type { ExternalSkillDTO, PagedResponseExternalSkillDTO, PagedResponseSkillProgressDTO, SkillProgressDetailsDTO, SkillProgressDTO } from '@/api/avenir-esr'
import { mockedTraceOverview } from '@/__mocks__/fixtures/student/traces.fixtures'
import {

  ESkillKind,
  ESkillLevel,
  ESkillReferentialType

} from '@/api/avenir-esr'

export function createMockedSkillProgressDTO () {
  return {
    id: crypto.randomUUID(),
    skillId: crypto.randomUUID(),
    title: `Ma super compétence complémentaire`,
    pathSegments: ['Catégorie', `Sous-catégorie`],
    type: ESkillReferentialType.ROME4,
    level: ESkillLevel.ADVANCED,
    reflection: `Ecrit reflexif de la compétence déclarée`,
    valorized: false,
    associationsCount: { traceAssociationsCount: 0, declaredActivityAssociationsCount: 0 }
  }
}

export function createMockedPagedResponseSkillProgressDTO (pageSize: number, totalElements: number, page: number): PagedResponseSkillProgressDTO {
  const mockedSkills: SkillProgressDTO[] = []
  const levels = Object.values(ESkillLevel)

  if (totalElements === 0) {
    return {
      data: [],
      page: { pageSize, totalElements, totalPages: 0, page }
    }
  }

  for (let i = 1; i <= totalElements; i++) {
    const skill: SkillProgressDTO = {
      id: crypto.randomUUID(),
      skillId: crypto.randomUUID(),
      title: `Ma super compétence complémentaire ${i}`,
      pathSegments: ['Catégorie', `Sous-catégorie ${i}`],
      type: ESkillReferentialType.ROME4,
      level: levels[i % levels.length],
      reflection: `Ecrit reflexif de la compétence déclarée ${i}`,
      valorized: false,
      associationsCount: { traceAssociationsCount: 0, declaredActivityAssociationsCount: 0 }
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

export function createMockedSearchExternalSkillsDTO (pageSize: number, totalElements: number, page: number, keyword: string): PagedResponseExternalSkillDTO {
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

  const filteredSkills: ExternalSkillDTO[] = allSkills
    .filter(title => title.toLowerCase().includes(keyword.toLowerCase()))
    .map(title => ({
      id: `search-${crypto.randomUUID()}`,
      title,
      pathSegments: ['Compétence', 'professionnelle', title.toLowerCase()],
      type: ESkillReferentialType.ROME4
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

export function createMockedAssociatedExternalSkillIds (count: number = 3): string[] {
  return Array.from({ length: count }, () => crypto.randomUUID())
}

export function createMockedSkillProgressDetailsDTO (skillId: string): SkillProgressDetailsDTO {
  return {
    id: skillId,
    skillId: crypto.randomUUID(),
    title: 'Conduire un projet de bout en bout',
    pathSegments: [
      {
        type: ESkillKind.ISSUE,
        libelle: 'Aider les entreprises à gérer des projets complexes et à s\'adapter aux mutations du marché du travail'
      },
      {
        type: ESkillKind.TARGET,
        libelle: 'Développer une approche par compétences pour favoriser la mobilité professionnelle et l\'employabilité des individus.'
      },
      {
        type: ESkillKind.MACRO_SKILL,
        libelle: 'Conduire un projet de bout en bout'
      }
    ],
    reflection: `Voici les enjeux et les objectifs de cette compétence "Conduire un projet de bout en bout"
Enjeu : Aider les entreprises à gérer des projets complexes et à s'adapter aux mutations du marché du travail
Objectif : Développer une approche par compétences pour favoriser la mobilité professionnelle et l'employabilité des individus.`,
    type: ESkillReferentialType.ROME4,
    level: ESkillLevel.ADVANCED,
    traceAssociations: mockedTraceOverview,
    createdAt: '2023-10-10T10:00:00Z',
    updatedAt: '2023-10-15T12:00:00Z',
    valorized: false
  }
}

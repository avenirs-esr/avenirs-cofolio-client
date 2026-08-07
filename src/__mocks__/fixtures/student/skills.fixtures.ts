import { createMockedTraceAssociations } from '@/__mocks__/fixtures/student/activities.fixtures'
import { createMockedDeclaredExperiencesAssociations } from '@/__mocks__/fixtures/student/declaredExperiences.fixtures'
import { mockedTraceOverview } from '@/__mocks__/fixtures/student/traces.fixtures'
import {
  type AssociationSearchResultDeclaredSkillIDTO,
  type DeclaredActivityAssociationDTO,
  type DeclaredSkillAssociationsDTO,
  type DeclaredSkillProgressDetailsDTO,
  type DeclaredSkillProgressDTO,
  EActivityThematic,
  EDeclaredActivityStatus,
  EDeclaredSkillLevel,
  EExternalSkillCategoryType,
  EExternalSkillType,
  type ExternalSkillDTO,
  type PagedResponseAssociationSearchResultDeclaredSkillIDTO,
  type PagedResponseDeclaredSkillProgressDTO,
  type PagedResponseExternalSkillDTO
} from '@/api/avenir-esr'

export function createMockedDeclaredSkillProgressDTO () {
  return {
    id: crypto.randomUUID(),
    title: `Ma super compétence complémentaire`,
    pathSegments: ['Catégorie', `Sous-catégorie`],
    type: EExternalSkillType.ROME4,
    level: EDeclaredSkillLevel.ADVANCED,
    reflection: `Ecrit reflexif de la compétence déclarée`,
    valorized: false,
    associationsCount: { traceAssociationsCount: 0, declaredActivityAssociationsCount: 0 }
  }
}

export function createMockedPagedResponseDeclaredSkillProgressDTO (pageSize: number, totalElements: number, page: number): PagedResponseDeclaredSkillProgressDTO {
  const mockedSkills: DeclaredSkillProgressDTO[] = []
  const levels = Object.values(EDeclaredSkillLevel)

  if (totalElements === 0) {
    return {
      data: [],
      page: { pageSize, totalElements, totalPages: 0, page }
    }
  }

  for (let i = 1; i <= totalElements; i++) {
    const skill: DeclaredSkillProgressDTO = {
      id: crypto.randomUUID(),
      title: `Ma super compétence complémentaire ${i}`,
      pathSegments: ['Catégorie', `Sous-catégorie ${i}`],
      type: EExternalSkillType.ROME4,
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
      type: EExternalSkillType.ROME4
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

export function createMockedDeclaredActivitiesAssociations (count: number): DeclaredActivityAssociationDTO[] {
  return Array.from({ length: count }, (_, index) => ({
    associationId: `declared-activity-association-${index + 1}`,
    declaredActivity: {
      id: `declared-activity-${index + 1}`,
      activityId: `activity-${index + 1}`,
      title: `Activité déclarée associée ${index + 1}`,
      thematic: EActivityThematic.TRANSVERSAL,
      summary: `Résumé de l'activité déclarée ${index + 1}`,
      description: `<h3>Description de l'activité déclarée ${index + 1}</h3><p>Voici une description détaillée de l'activité déclarée associée ${index + 1}.</p>`,
      status: EDeclaredActivityStatus.IN_PROGRESS,
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  }))
}

export const mockedDeclaredSkillAssociations: DeclaredSkillAssociationsDTO = {
  traceAssociations: createMockedTraceAssociations(2),
  declaredActivityAssociations: createMockedDeclaredActivitiesAssociations(1),
  declaredExperienceAssociations: createMockedDeclaredExperiencesAssociations(2)
}

export function createMockedPagedResponseAssociationSearchResultDeclaredSkillIDTO (
  pageSize: number,
  page: number,
  keyword: string
): PagedResponseAssociationSearchResultDeclaredSkillIDTO {
  const allSkills: AssociationSearchResultDeclaredSkillIDTO[] = [
    { id: 'skill-search-1', title: 'Conduire un projet de bout en bout', type: EExternalSkillType.ROME4, disabled: false },
    { id: 'skill-search-2', title: 'Analyser et synthétiser des informations', type: EExternalSkillType.ROME4, disabled: false },
    { id: 'skill-search-3', title: 'Développement web et compétence numérique', type: EExternalSkillType.ROME4, disabled: false },
    { id: 'skill-search-4', title: 'Gestion de projet et compétences managériales', type: EExternalSkillType.ROME4, disabled: false },
    { id: 'skill-search-5', title: 'Communication interpersonnelle', type: EExternalSkillType.ROME4, disabled: false },
  ]

  const filtered = keyword
    ? allSkills.filter(s => s.title.toLowerCase().includes(keyword.toLowerCase()))
    : allSkills

  const start = page * pageSize
  const end = start + pageSize
  const data = filtered.slice(start, end)
  const totalElements = filtered.length
  const totalPages = Math.ceil(totalElements / pageSize)

  return {
    data,
    page: { pageSize, totalElements, totalPages, page }
  }
}

export function createMockedDeclaredSkillProgressDetailsDTO (skillId: string): DeclaredSkillProgressDetailsDTO {
  return {
    id: skillId,
    title: 'Conduire un projet de bout en bout',
    pathSegments: [
      {
        type: EExternalSkillCategoryType.ISSUE,
        libelle: 'Aider les entreprises à gérer des projets complexes et à s\'adapter aux mutations du marché du travail'
      },
      {
        type: EExternalSkillCategoryType.TARGET,
        libelle: 'Développer une approche par compétences pour favoriser la mobilité professionnelle et l\'employabilité des individus.'
      },
      {
        type: EExternalSkillCategoryType.MACRO_SKILL,
        libelle: 'Conduire un projet de bout en bout'
      }
    ],
    reflection: `Voici les enjeux et les objectifs de cette compétence "Conduire un projet de bout en bout"
Enjeu : Aider les entreprises à gérer des projets complexes et à s'adapter aux mutations du marché du travail
Objectif : Développer une approche par compétences pour favoriser la mobilité professionnelle et l'employabilité des individus.`,
    type: EExternalSkillType.ROME4,
    level: EDeclaredSkillLevel.ADVANCED,
    traceAssociations: mockedTraceOverview,
    createdAt: '2023-10-10T10:00:00Z',
    updatedAt: '2023-10-15T12:00:00Z',
    valorized: false
  }
}

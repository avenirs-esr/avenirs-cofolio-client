import { createMockedDeclaredExperiences } from '@/__mocks__/fixtures/student/declaredExperiences.fixtures'
import { mockedDeclaredPrograms } from '@/__mocks__/fixtures/student/declaredPrograms.fixtures'
import { mockedTraceOverview } from '@/__mocks__/fixtures/student/traces.fixtures'
import {
  type AssociationsDTO,
  type AssociationSearchResultDTO,
  type DeclaredActivityAssociationDTO,
  type DeclaredExperienceAssociationDTO,
  type DeclaredProgramAssociationDTO,
  type DeclaredSkillAssociationDTO,
  EActivityThematic,
  EAssociationContextType,
  EDeclaredActivityStatus,
  EDeclaredSkillLevel,
  EExperienceType,
  EExternalSkillType,
  ETraceAuthorType,
  type PagedResponseAssociationSearchResultDTO,
  type SearchForAssociationParams,
  type TraceAssociationDTO,
  type TraceOverviewDTO
} from '@/api/avenir-esr'

export const mockedEmptyAssociations: AssociationsDTO = {
  traceAssociations: [],
  declaredActivityAssociations: [],
  declaredSkillAssociations: [],
  declaredExperienceAssociations: [],
  declaredProgramAssociations: []
}

export function createMockedTraceAssociations (traceCount: number, idsToAssociate?: string[]): TraceAssociationDTO[] {
  return Array.from({ length: traceCount }, (_, index) => ({
    associationId: `association-${index + 1}`,
    trace: {
      id: idsToAssociate?.[index] ?? `trace-${index + 1}`,
      title: `Trace #${index + 1} associée à l\'activité`,
      authorType: (index + 1) % 2 === 0 ? ETraceAuthorType.COLLECTIVE : ETraceAuthorType.PERSONAL,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  }))
}

export function createMockedDeclaredActivityAssociation (
  overrides: Partial<DeclaredActivityAssociationDTO['declaredActivity']> & { associationId: string }
): DeclaredActivityAssociationDTO {
  const { associationId, ...declaredActivityOverrides } = overrides

  return {
    associationId,
    declaredActivity: {
      id: `activity-${associationId}`,
      activityId: `activity-${associationId}`,
      title: `Activity ${associationId}`,
      thematic: EActivityThematic.SELF_KNOWLEDGE,
      summary: 'summary',
      description: 'description',
      status: EDeclaredActivityStatus.SUBSCRIBED,
      ...declaredActivityOverrides
    }
  }
}

export function createMockedDeclaredActivityAssociations (count: number): DeclaredActivityAssociationDTO[] {
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

export function createMockedDeclaredSkillAssociations (count: number): DeclaredSkillAssociationDTO[] {
  return Array.from({ length: count }, (_, index) => ({
    associationId: `association-id-${index}`,
    declaredSkill: {
      id: `declared-skill-id-${index}`,
      title: `Declared skill ${index + 1}`,
      pathSegments: ['first', 'second', 'third'],
      type: EExternalSkillType.ROME4,
      level: EDeclaredSkillLevel.BEGINNER,
      reflection: `Description for declared skill ${index + 1}`,
      valorized: false,
      associationsCount: { traceAssociationsCount: 0, declaredActivityAssociationsCount: 0 }
    }
  }))
}

export function createMockedDeclaredExperienceAssociations (count: number): DeclaredExperienceAssociationDTO[] {
  return createMockedDeclaredExperiences(count).map((declaredExperience, index) => ({
    associationId: `declared-experience-association-${index + 1}`,
    declaredExperience
  }))
}

export function createMockedDeclaredProgramAssociations (count: number): DeclaredProgramAssociationDTO[] {
  return mockedDeclaredPrograms.slice(0, count).map((declaredProgram, index) => ({
    associationId: `declared-program-association-${index + 1}`,
    declaredProgram
  }))
}

export const mockedTraceDeclaredSkillAssociations: DeclaredSkillAssociationDTO[] = [
  {
    associationId: 'id-1-1',
    declaredSkill: {
      id: 'declared-1',
      title: 'Gestion de projet agile',
      level: EDeclaredSkillLevel.ADVANCED,
      pathSegments: ['Management', 'Gestion de projet'],
      type: EExternalSkillType.ROME4,
      valorized: false,
      associationsCount: { traceAssociationsCount: 0, declaredActivityAssociationsCount: 0 }
    }
  },
  {
    associationId: 'id-1-2',
    declaredSkill: {
      id: 'declared-2',
      title: 'Communication interpersonnelle',
      level: EDeclaredSkillLevel.COMPETENT,
      pathSegments: ['Soft Skills', 'Communication'],
      type: EExternalSkillType.ROME4,
      valorized: false,
      associationsCount: { traceAssociationsCount: 0, declaredActivityAssociationsCount: 0 }
    }
  },
  {
    associationId: 'id-1-3',
    declaredSkill: {
      id: 'declared-3',
      title: 'Analyse de données',
      level: EDeclaredSkillLevel.EXPERT,
      pathSegments: ['Technique', 'Data Science'],
      type: EExternalSkillType.ROME4,
      valorized: false,
      associationsCount: { traceAssociationsCount: 0, declaredActivityAssociationsCount: 0 }
    }
  }
]

export const mockedTraceDeclaredActivityAssociations: DeclaredActivityAssociationDTO[] = [
  {
    associationId: 'id-2-1',
    declaredActivity: {
      id: 'c1c9f6d2-6c2b-4a5e-9c4f-8e2a6b1d3f01',
      activityId: '2a9f6c4d-8b1e-4d33-9c7a-5e2b8f1c6d77',
      title: 'Définir ses valeurs',
      thematic: EActivityThematic.SELF_KNOWLEDGE,
      status: EDeclaredActivityStatus.IN_PROGRESS,
      summary: 'Activité faisant partie de la catégorie Connaissance de soi. Elle permet à l\'étudiant.e d\'identifier les valeurs essentielles qui orientent ses choix et d\'analyser la manière dont elles se traduisent dans ses comportements quotidiens. Cette réflexion constitue une base structurante pour construire un projet personnel et professionnel cohérent.',
      description: '<h3>Objectifs</h3><ul><li>Identifier les valeurs qui guident les choix de l\'étudiant.e</li><li>Analyser comment ces valeurs se manifestent dans les comportements quotidiens</li><li>Utiliser cette connaissance de soi pour construire un projet personnel et professionnel cohérent</li></ul>',
      startDate: '2025-01-10',
      endDate: '2025-01-20',
    },
  },
  {
    associationId: 'id-2-2',
    declaredActivity: {
      id: '7f3a2b91-3d44-4c6a-8a9e-2b6d5f1c0a22',
      activityId: '7b3d4e91-6f2a-4c88-9a1e-5d3f7b2c8e44',
      title: 'Explorer ses pistes d\'orientation',
      thematic: EActivityThematic.FUTURE_PLANS,
      status: EDeclaredActivityStatus.SUBSCRIBED,
      summary: 'Activité centrée sur l\'exploration des futurs possibles. L\'étudiant.e identifie différents domaines professionnels susceptibles de correspondre à son profil et analyse les conditions d\'accès, les environnements de travail et les perspectives d\'évolution associées.',
      description: '<h3>Objectifs</h3><ul><li>Identifier différents domaines professionnels correspondant au profil de l\'étudiant.e</li><li>Analyser les conditions d\'accès, les environnements de travail et les perspectives d\'évolution associées à ces domaines</li><li>Utiliser ces informations pour affiner son projet professionnel</li></ul>',
    }
  }
]

export const mockedTraceAssociations: AssociationsDTO = {
  ...mockedEmptyAssociations,
  declaredActivityAssociations: mockedTraceDeclaredActivityAssociations,
  declaredSkillAssociations: mockedTraceDeclaredSkillAssociations,
  declaredProgramAssociations: createMockedDeclaredProgramAssociations(1)
}

export const mockedDeclaredActivityAssociations: AssociationsDTO = {
  ...mockedEmptyAssociations,
  traceAssociations: createMockedTraceAssociations(6),
  declaredSkillAssociations: createMockedDeclaredSkillAssociations(3)
}

export const mockedDeclaredSkillAssociations: AssociationsDTO = {
  ...mockedEmptyAssociations,
  traceAssociations: createMockedTraceAssociations(2),
  declaredActivityAssociations: createMockedDeclaredActivityAssociations(1),
  declaredExperienceAssociations: createMockedDeclaredExperienceAssociations(2),
  declaredProgramAssociations: createMockedDeclaredProgramAssociations(2)
}

export const mockedDeclaredProgramAssociations: AssociationsDTO = {
  ...mockedEmptyAssociations,
  traceAssociations: createMockedTraceAssociations(2),
  declaredSkillAssociations: createMockedDeclaredSkillAssociations(3)
}

export function createMockedDeclaredExperienceAssociationsDTO (traces: TraceOverviewDTO[] = mockedTraceOverview): AssociationsDTO {
  return {
    ...mockedEmptyAssociations,
    traceAssociations: traces.map((trace, index) => ({
      associationId: `declared-experience-trace-association-${index + 1}`,
      trace
    }))
  }
}

/**
 * Returns the mocked associations of an element of the given context type.
 */
export function createMockedAssociations (contextType: EAssociationContextType): AssociationsDTO {
  switch (contextType) {
    case EAssociationContextType.TRACE:
      return mockedTraceAssociations
    case EAssociationContextType.DECLARED_ACTIVITY:
      return mockedDeclaredActivityAssociations
    case EAssociationContextType.DECLARED_SKILL:
      return mockedDeclaredSkillAssociations
    case EAssociationContextType.DECLARED_EXPERIENCE:
      return createMockedDeclaredExperienceAssociationsDTO()
    case EAssociationContextType.DECLARED_PROGRAM:
      return mockedDeclaredProgramAssociations
    default:
      return mockedEmptyAssociations
  }
}

export const mockedActivitySearchResults: AssociationSearchResultDTO[] = [
  { id: 'activity-search-1', title: 'Définir ses valeurs', category: EActivityThematic.SELF_KNOWLEDGE, disabled: false },
  { id: 'activity-search-2', title: 'Explorer ses pistes d\'orientation', category: EActivityThematic.FUTURE_PLANS, disabled: false },
  { id: 'activity-search-3', title: 'Construire son projet professionnel', category: EActivityThematic.FUTURE_PLANS, disabled: true }
]

export const mockedSkillSearchResults: AssociationSearchResultDTO[] = [
  { id: 'skill-search-1', title: 'Gestion de projet agile', category: EExternalSkillType.ROME4, disabled: false },
  { id: 'skill-search-2', title: 'Communication interpersonnelle', category: EExternalSkillType.XXI, disabled: false },
  { id: 'skill-search-3', title: 'Analyse de données', category: EExternalSkillType.ROME4, disabled: true }
]

export const mockedExperienceSearchResults: AssociationSearchResultDTO[] = [
  { id: 'experience-search-1', title: 'Définir ses valeurs', category: EExperienceType.PERSONAL, disabled: false },
  { id: 'experience-search-2', title: 'Explorer ses pistes d\'orientation', category: EExperienceType.PROFESSIONAL, disabled: false },
  { id: 'experience-search-3', title: 'Développeur Web Full Stack', category: EExperienceType.PROFESSIONAL, disabled: true }
]

export const mockedProgramSearchResults: AssociationSearchResultDTO[] = [
  { id: 'program-search-1', title: 'Master en Informatique', category: 'Université Paris-Saclay', disabled: false },
  { id: 'program-search-2', title: 'Licence de Psychologie', category: 'Université Lumière Lyon 2', disabled: false },
  { id: 'program-search-3', title: 'BUT Métiers du Multimédia et de l\'Internet', category: 'IUT de Bordeaux', disabled: true }
]

/**
 * Returns 5 associated and 5 unassociated traces, filtered on their association status when given.
 */
export function createMockedTraceSearchResults (isAssociated?: boolean): AssociationSearchResultDTO[] {
  return [true, false]
    .filter(associated => isAssociated === undefined || associated === isAssociated)
    .flatMap(associated => Array.from({ length: 5 }, (_, index) => ({
      id: `trace-${associated ? 'associee' : 'non-associee'}${index + 1}`,
      title: `Ma super trace ${associated ? 'associée' : 'non associée'} numéro ${index + 1}`,
      disabled: false
    })))
}

function getMockedSearchResults (associatedContextType: EAssociationContextType, isAssociated?: boolean): AssociationSearchResultDTO[] {
  switch (associatedContextType) {
    case EAssociationContextType.TRACE:
      return createMockedTraceSearchResults(isAssociated)
    case EAssociationContextType.DECLARED_ACTIVITY:
      return mockedActivitySearchResults
    case EAssociationContextType.DECLARED_SKILL:
      return mockedSkillSearchResults
    case EAssociationContextType.DECLARED_EXPERIENCE:
      return mockedExperienceSearchResults
    case EAssociationContextType.DECLARED_PROGRAM:
      return mockedProgramSearchResults
    default:
      return []
  }
}

/**
 * Returns the paginated elements of the given context type that can be associated, filtered on the search params.
 */
export function createMockedAssociationSearchResponse (
  associatedContextType: EAssociationContextType,
  { keyword, isAssociated, page = 0, pageSize = 100 }: SearchForAssociationParams = {}
): PagedResponseAssociationSearchResultDTO {
  const normalizedKeyword = keyword?.trim().toLowerCase()

  const filtered = getMockedSearchResults(associatedContextType, isAssociated)
    .filter(({ title }) => !normalizedKeyword || title.toLowerCase().includes(normalizedKeyword))

  const start = page * pageSize

  return {
    data: filtered.slice(start, start + pageSize),
    page: {
      page,
      pageSize,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize)
    }
  }
}

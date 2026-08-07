import {
  type AssociationSearchResultDeclaredActivityDTO,
  type AssociationSearchResultDeclaredSkillIDTO,
  type AssociationSearchResultTraceDTO,
  type DeclaredActivityAssociationDTO,
  type DeclaredSkillAssociationDTO,
  EActivityThematic,
  EDeclaredActivityStatus,
  EDeclaredSkillLevel,
  EExternalSkillType,
  EFileType,
  ETraceAuthorType,
  type FileDTO,
  type PagedResponseAssociationSearchResultDeclaredActivityDTO,
  type PagedResponseAssociationSearchResultDeclaredSkillIDTO,
  type PagedResponseAssociationSearchResultTraceDTO,
  type PagedResponseTraceViewDTO,
  type SearchTracesForAssociationParams,
  type TraceAssociationsDTO,
  type TraceConfigurationDTO,
  type TraceDeclaredActivityDTO,
  type TraceFilter,
  type TraceOverviewDTO,
  type TracesCreationResponse,
  type TracesSummaryDTO,
  type TracesViewParams,
  type TraceViewDTO

} from '@/api/avenir-esr'
import { getFileTypeFromFileName } from '@/common/utils/file/file'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { isAfter, isBefore, isSameDay, parseISO, startOfDay } from 'date-fns'

export const mockedTracesSummary: TracesSummaryDTO = {
  associated: 24,
  unassociated: 20,
  totalWarnings: 5,
  totalCriticals: 2,
}

export const mockedTraceOverview: TraceOverviewDTO[] = [
  {
    id: '4453f884-9081-43cb-95c6-d76c2bb59fd7',
    title: 'Prévenir la pollution à la source',
    authorType: ETraceAuthorType.PERSONAL,
    createdAt: '2024-05-13T08:42:17',
    updatedAt: '2024-05-13T08:42:17',
  },
  {
    id: 'trace2',
    title: 'Mettre en place des filières d\'économies circulaires',
    authorType: ETraceAuthorType.COLLECTIVE,
    aiUseJustification: 'Justification de l\'utilisation de l\'IA pour cette trace',
    createdAt: '2024-11-29T19:15:03',
    updatedAt: '2024-11-29T19:15:03'
  },
  {
    id: 'trace3',
    title: 'Évaluer l\'impact environnemental et économique',
    authorType: ETraceAuthorType.PERSONAL,
    createdAt: '2025-02-07T23:08:51',
    updatedAt: '2025-02-07T23:08:51',
  }
]

export const createDeletedTraceIdMock = (traceId: string) => `${traceId}-deleted`

export const invalidTraceId = 'invalid-trace-id'

export function createMockedTracesViewResponse (
  traceFilter: TraceFilter,
  tracesViewParams: TracesViewParams,
  totalElements: number,
): PagedResponseTraceViewDTO {
  const { isAssociated } = traceFilter
  const { keyword, page = 0, pageSize = PageSizes.FOUR, fromDate, toDate } = tracesViewParams
  const mockedTraces: TraceViewDTO[] = []

  for (let i = 1; i <= totalElements; i++) {
    const traceIsAssociated = isAssociated ?? i % 2 === 0
    const rawMonth = (i % 12) + 1
    const monthNumber = rawMonth < 10 ? `0${rawMonth}` : `${rawMonth}`
    const rawDay = (i % 28) + 1
    const dayNumber = rawDay < 10 ? `0${rawDay}` : `${rawDay}`

    const trace: TraceViewDTO = {
      isAssociated: traceIsAssociated,
      id: i === 1
        ? '4453f884-9081-43cb-95c6-d76c2bb59fd7'
        : `trace-${traceIsAssociated ? 'associee' : 'non-associee'}${i}`,
      title: `Ma super trace ${traceIsAssociated ? 'associée' : 'non associée'} numéro ${i}`,
      createdAt: `2025-${monthNumber}-${dayNumber}T10:42:00.000Z`,
      updatedAt: `2025-${monthNumber}-${dayNumber}T11:42:00.000Z`,
      authorType: ETraceAuthorType.PERSONAL,
      willBeDeletedAt: `2026-07-${dayNumber}T10:42:00.000Z`
    }

    mockedTraces.push(trace)
  }

  let filteredTraces = mockedTraces

  if (isAssociated !== undefined) {
    filteredTraces = filteredTraces.filter(trace => trace.isAssociated === isAssociated)
  }

  if (keyword?.trim()) {
    filteredTraces = filteredTraces.filter(trace =>
      trace.title.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  if (fromDate?.trim()) {
    const from = startOfDay(parseISO(fromDate))
    filteredTraces = filteredTraces.filter(trace =>
      isAfter(startOfDay(parseISO(trace.createdAt)), from)
      || isSameDay(startOfDay(parseISO(trace.createdAt)), from)
    )
  }

  if (toDate?.trim()) {
    const to = startOfDay(parseISO(toDate))
    filteredTraces = filteredTraces.filter(trace =>
      isBefore(startOfDay(parseISO(trace.createdAt)), to)
      || isSameDay(startOfDay(parseISO(trace.createdAt)), to)
    )
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedTraces = filteredTraces.slice(start, end)
  const totalPages = Math.ceil(filteredTraces.length / pageSize)

  return {
    data: paginatedTraces,
    page: { pageSize, totalElements: filteredTraces.length, totalPages, page }
  }
}

export const mockedLockedDeclaredActivities: TraceDeclaredActivityDTO[] = [
  {
    activityId: 'locked-activity-1',
    activityTitle: 'Activité soumise',
    activityStatus: EDeclaredActivityStatus.SUBMITTED
  },
  {
    activityId: 'locked-activity-2',
    activityTitle: 'Activité terminée',
    activityStatus: EDeclaredActivityStatus.COMPLETED
  }
]

export const mockedTracesConfiguration: TraceConfigurationDTO = {
  maxRemainingDays: 30,
  maxRemainingDaysBeforeWarning: 15,
  maxRemainingDaysBeforeCritical: 7,
}

export function createMockedTraceCreationResponse (title: string): TracesCreationResponse {
  return {
    traceId: `trace-${title}-${Date.now()}`
  }
}

export function createMockedAttachmentUploadResponse (traceId: string, file: File): FileDTO {
  return {
    id: `attachment-${Date.now()}`,
    fileName: traceId,
    fileType: getFileTypeFromFileName(file.name),
    fileSize: file.size,
    url: 'exemple.com/image',
    uploadedAt: '2024-01-15T10:30:00'
  }
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

export const mockedTraceAssociations: TraceAssociationsDTO = {
  declaredActivityAssociations: mockedTraceDeclaredActivityAssociations,
  declaredSkillAssociations: mockedTraceDeclaredSkillAssociations
}

export const mockedEmptyTraceAssociations: TraceAssociationsDTO = {
  declaredActivityAssociations: [],
  declaredSkillAssociations: []
}

export const mockedTraceDetailed = {
  id: '4453f884-9081-43cb-95c6-d76c2bb59fd7',
  title: 'Développement d\'un ePortfolio',
  isAssociated: false,
  valorized: true,
  link: 'https://example.com/trace/4453f884-9081-43cb-95c6-d76c2bb59fd7',
  createdAt: '2025-06-16T10:42:00.000Z',
  updatedAt: '2025-06-17T15:18:00.000Z',
  aiUseJustification: 'An awesome justification',
  authorType: ETraceAuthorType.PERSONAL,
  personalNote: 'An awesome personal note',
  attachment: {
    id: 'mock-attachment',
    fileName: 'An awesome attachment',
    fileType: EFileType.TXT,
    fileSize: 1,
    url: 'exemple.com/image',
    uploadedAt: '2025-06-02T11:42:00.000Z',
  },
  lockedDeclaredActivities: mockedLockedDeclaredActivities,
  traceAssociations: mockedTraceAssociations
}

export const mockedTraceDetailedWithFile = {
  ...mockedTraceDetailed,
  link: undefined,
}

export const mockedTraceDetailedWithLink = {
  ...mockedTraceDetailed,
  attachment: undefined,
}

export function createMockedSearchTracesForAssociationResponse (
  params?: SearchTracesForAssociationParams
): PagedResponseAssociationSearchResultTraceDTO {
  const {
    isAssociated,
    keyword,
    page = 0,
    pageSize = PageSizes.FOUR
  } = params ?? {}

  const associatedResponse = createMockedTracesViewResponse(
    { isAssociated: true },
    {
      keyword: undefined,
      page: 0,
      pageSize: 5
    },
    5
  )

  const unassociatedResponse = createMockedTracesViewResponse(
    { isAssociated: false },
    {
      keyword: undefined,
      page: 0,
      pageSize: 5
    },
    5
  )

  const baseTraces
    = isAssociated === undefined
      ? [...associatedResponse.data, ...unassociatedResponse.data]
      : isAssociated
        ? associatedResponse.data
        : unassociatedResponse.data

  const normalizedSearch = keyword?.trim().toLowerCase()

  const filteredTraces = normalizedSearch
    ? baseTraces.filter(trace => trace.title.toLowerCase().includes(normalizedSearch))
    : baseTraces

  const start = page * pageSize
  const end = start + pageSize
  const paginatedTraces = filteredTraces.slice(start, end)

  const data: AssociationSearchResultTraceDTO[] = paginatedTraces.map(trace => ({
    id: trace.id,
    title: trace.title,
    disabled: false
  }))

  return {
    data,
    page: {
      page,
      pageSize,
      totalElements: filteredTraces.length,
      totalPages: Math.ceil(filteredTraces.length / pageSize)
    }
  }
}

export const mockedTraceActivitySearchResults: AssociationSearchResultDeclaredActivityDTO[] = [
  {
    id: 'activity-search-1',
    title: 'Définir ses valeurs',
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    disabled: false
  },
  {
    id: 'activity-search-2',
    title: 'Explorer ses pistes d\'orientation',
    thematic: EActivityThematic.FUTURE_PLANS,
    disabled: false
  },
  {
    id: 'activity-search-3',
    title: 'Construire son projet professionnel',
    thematic: EActivityThematic.FUTURE_PLANS,
    disabled: true
  }
]

export const mockedSkillSearchResults: AssociationSearchResultDeclaredSkillIDTO[] = [
  {
    id: 'skill-search-1',
    title: 'Gestion de projet agile',
    type: EExternalSkillType.ROME4,
    disabled: false
  },
  {
    id: 'skill-search-2',
    title: 'Communication interpersonnelle',
    type: EExternalSkillType.XXI,
    disabled: false
  },
  {
    id: 'skill-search-3',
    title: 'Analyse de données',
    type: EExternalSkillType.ROME4,
    disabled: true
  }
]

export function createMockedSearchSkillsForAssociationResponse (
  params?: { keyword?: string, page?: number, pageSize?: number }
): PagedResponseAssociationSearchResultDeclaredSkillIDTO {
  const { keyword, page = 0, pageSize = 100 } = params ?? {}

  let filtered = mockedSkillSearchResults

  if (keyword?.trim()) {
    filtered = filtered.filter(skill =>
      skill.title.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedData = filtered.slice(start, end)

  return {
    data: paginatedData,
    page: {
      page,
      pageSize,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize)
    }
  }
}

export function createMockedSearchActivitiesForAssociationResponse (
  params?: { keyword?: string, page?: number, pageSize?: number }
): PagedResponseAssociationSearchResultDeclaredActivityDTO {
  const { keyword, page = 0, pageSize = 100 } = params ?? {}

  let filtered = mockedTraceActivitySearchResults

  if (keyword?.trim()) {
    filtered = filtered.filter(activity =>
      activity.title.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedData = filtered.slice(start, end)

  return {
    data: paginatedData,
    page: {
      page,
      pageSize,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize)
    }
  }
}

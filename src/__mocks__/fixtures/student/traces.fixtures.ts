import {
  type AttachmentUploadDTO,
  EAdditionalSkillLevel,
  EAmsStatus,
  EExternalSkillType,
  EFileType,
  ESkillLevelStatus,
  type PagedResponseTraceViewDTO,
  type TraceAssociationsDTO,
  type TraceConfigurationDTO,
  type TraceFilter,
  type TraceOverviewDTO,
  type TracesCreationResponse,
  type TracesSummaryDTO,
  type TracesViewParams,
  type TraceViewDTO
} from '@/api/avenir-esr'
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
    traceId: 'trace1',
    title: 'Prévenir la pollution à la source',
    skillCount: 1,
    AMSCount: 8,
    isGroup: false,
    programName: 'Master Chimie Verte et Éco-innovations',
    createdAt: '2024-05-13T08:42:17',
    updatedAt: '2024-05-13T08:42:17',
  },
  {
    traceId: 'trace2',
    title: 'Mettre en place des filières d’économies circulaires',
    skillCount: 2,
    AMSCount: 7,
    isGroup: true,
    programName: 'Master Chimie Verte et Éco-innovations',
    createdAt: '2024-11-29T19:15:03',
    updatedAt: '2024-11-29T19:15:03'
  },
  {
    traceId: 'trace3',
    title: 'Évaluer l’impact environnemental et économique',
    skillCount: 3,
    AMSCount: 6,
    isGroup: false,
    programName: 'Master Chimie Verte et Éco-innovations',
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
  const { isAssociated = false } = traceFilter
  const { keyword, page = 0, pageSize = PageSizes.FOUR, fromDate, toDate } = tracesViewParams
  const mockedTraces: TraceViewDTO[] = []

  for (let i = 1; i <= totalElements; i++) {
    const rawMonth = (i % 12) + 1
    const monthNumber = rawMonth < 10 ? `0${rawMonth}` : `${rawMonth}`
    const rawDay = (i % 28) + 1
    const dayNumber = rawDay < 10 ? `0${rawDay}` : `${rawDay}`
    const trace = {
      isAssociated,
      id: `trace-${isAssociated ? 'associee' : 'non-associee'}${i}`,
      title: `Ma super trace ${isAssociated ? 'associée' : 'non associée'} numéro ${i}`,
      createdAt: `2025-${monthNumber}-${dayNumber}T10:42:00.000Z`,
      updatedAt: `2025-${monthNumber}-${dayNumber}T11:42:00.000Z`,
      willBeDeletedAt: `2026-07-${dayNumber}T10:42:00.000Z`
    }
    mockedTraces.push(trace)
  }

  let filteredTraces = mockedTraces.filter(trace => trace.isAssociated === isAssociated)

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

function getFileTypeFromFileName (fileName: string): EFileType {
  const extension = fileName.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'pdf': return EFileType.PDF
    case 'doc': return EFileType.DOC
    case 'docx': return EFileType.DOCX
    case 'jpg':
    case 'jpeg': return EFileType.JPEG
    case 'png': return EFileType.PNG
    default: return EFileType.PDF
  }
}

export function createMockedAttachmentUploadResponse (traceId: string, file: File): AttachmentUploadDTO {
  return {
    id: `attachment-${Date.now()}`,
    fileName: traceId,
    fileType: getFileTypeFromFileName(file.name),
    fileSize: file.size,
    version: 1,
    uploadedAt: '2024-01-15T10:30:00'
  }
}

export const mockedTraceAssociations: TraceAssociationsDTO = {
  skillLevelAssociations: [
    {
      id: 'skill-1',
      skillTitle: 'Compétence Prévenir la pollution à la source',
      level: 'Niv. 1',
      status: ESkillLevelStatus.VALIDATED,
      ams: {
        id: 'ams-1',
        title: 'SAE 1.4 Etude des risques et impacts environnementaux',
        status: EAmsStatus.COMPLETED
      }
    },
    {
      id: 'skill-2',
      skillTitle: 'Compétence Évaluer l\'impact environnement',
      level: 'Niv. 2',
      status: ESkillLevelStatus.UNDER_ACQUISITION,
      ams: {
        id: 'ams-2',
        title: 'SAE 2.3 Analyse du cycle de vie',
        status: EAmsStatus.IN_PROGRESS
      }
    },
    {
      id: 'skill-3',
      skillTitle: 'Compétence Gérer les déchets',
      level: 'Niv. 1',
      status: ESkillLevelStatus.UNDER_REVIEW
    },
    {
      id: 'skill-4',
      skillTitle: 'Compétence Optimiser les ressources',
      level: 'Niv. 3',
      status: ESkillLevelStatus.VALIDATED,
      ams: {
        id: 'ams-3',
        title: 'SAE 3.1 Optimisation énergétique',
        status: EAmsStatus.COMPLETED
      }
    }
  ],
  additionalSkillAssociations: [
    {
      id: 'additional-1',
      title: 'Gestion de projet agile',
      level: EAdditionalSkillLevel.ADVANCED,
      pathSegments: ['Management', 'Gestion de projet'],
      type: EExternalSkillType.ROME4
    },
    {
      id: 'additional-2',
      title: 'Communication interpersonnelle',
      level: EAdditionalSkillLevel.COMPETENT,
      pathSegments: ['Soft Skills', 'Communication'],
      type: EExternalSkillType.ROME4
    },
    {
      id: 'additional-3',
      title: 'Analyse de données',
      level: EAdditionalSkillLevel.EXPERT,
      pathSegments: ['Technique', 'Data Science'],
      type: EExternalSkillType.ROME4
    }
  ]
}

export const mockedTraceDetailed = {
  id: 'trace1',
  title: 'Développement d\'un ePortfolio',
  isAssociated: false,
  createdAt: '2025-06-16T10:42:00.000Z',
  updatedAt: '2025-06-17T15:18:00.000Z',
  programName: 'An awesome program',
  aiUseJustification: 'An awesome justification',
  isGroup: false,
  personalNote: 'An awesome personal note',
  attachment: {
    id: 'mock-attachment',
    fileName: 'An awesome attachment',
    fileType: EFileType.TXT,
    fileSize: 1,
    version: 1,
    uploadedAt: '2025-06-02T11:42:00.000Z',
  },
  traceAssociations: mockedTraceAssociations
}

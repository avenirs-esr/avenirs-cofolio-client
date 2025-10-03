import {
  type AssociationsTraceDTO,
  type AttachmentUploadDTO,
  EAdditionalSkillLevel,
  EAdditionalSkillType,
  EAmsStatus,
  EFileType,
  ESkillLevelStatus,
  type PagedResponseTraceViewDTO,
  type TraceConfigurationDTO,
  type TracesCreationResponse,
  type TracesSummaryDTO,
  type TraceViewDTO
} from '@/api/avenir-esr'

export const mockedTracesSummary: TracesSummaryDTO = {
  associated: 24,
  unassociated: 20,
  totalWarnings: 5,
  totalCriticals: 2,
}

export const createDeletedTraceIdMock = (traceId: string) => `${traceId}-deleted`

export const invalidTraceId = 'invalid-trace-id'

export function createMockedTracesViewResponse (pageSize: number, totalElements: number, page: number, isAssociated = false): PagedResponseTraceViewDTO {
  const mockedTraces: TraceViewDTO[] = []
  for (let i = 1; i <= totalElements; i++) {
    const rawDay = (i % 28) + 1
    const dayNumber = rawDay < 10 ? `0${rawDay}` : `${rawDay}`
    const rand = Math.floor(Math.random() * 31) + 1
    const randomDayNumber = rand < 10 ? `0${rand}` : rand
    const trace = {
      isAssociated,
      id: `trace${i}`,
      title: `Ma super trace numéro ${i}`,
      createdAt: `2025-06-${dayNumber}T10:42:00.000Z`,
      updatedAt: `2025-06-${dayNumber}T11:42:00.000Z`,
      willBeDeletedAt: `2026-07-${randomDayNumber}T10:42:00.000Z`
    }
    mockedTraces.push(trace)
  }

  let filteredTraces = mockedTraces

  if (keyword && keyword.trim() !== '') {
    filteredTraces = mockedTraces.filter(trace =>
      trace.title.toLowerCase().includes(keyword.toLowerCase())
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

export const mockedTraceAssociations: AssociationsTraceDTO = {
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
      type: EAdditionalSkillType.ROME4
    },
    {
      id: 'additional-2',
      title: 'Communication interpersonnelle',
      level: EAdditionalSkillLevel.COMPETENT,
      pathSegments: ['Soft Skills', 'Communication'],
      type: EAdditionalSkillType.ROME4
    },
    {
      id: 'additional-3',
      title: 'Analyse de données',
      level: EAdditionalSkillLevel.EXPERT,
      pathSegments: ['Technique', 'Data Science'],
      type: EAdditionalSkillType.ROME4
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
  associationsTrace: mockedTraceAssociations
}

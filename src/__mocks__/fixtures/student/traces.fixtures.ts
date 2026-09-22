import {
  EDeclaredActivityStatus,
  EFileType,
  ETraceAuthorType,
  type FileDTO,
  type PagedResponseTraceViewDTO,
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
  lockedDeclaredActivities: mockedLockedDeclaredActivities
}

export const mockedTraceDetailedWithFile = {
  ...mockedTraceDetailed,
  link: undefined,
}

export const mockedTraceDetailedWithLink = {
  ...mockedTraceDetailed,
  attachment: undefined,
}

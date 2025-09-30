import {
  type AttachmentUploadDTO,
  EFileType,
  ETraceStatus,
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

export function createMockedTracesViewResponse (pageSize: number, totalElements: number, page: number, status: ETraceStatus = ETraceStatus.UNASSOCIATED): PagedResponseTraceViewDTO {
  const mockedTraces: TraceViewDTO[] = []
  for (let i = 1; i <= totalElements; i++) {
    const rawDay = (i % 28) + 1
    const dayNumber = rawDay < 10 ? `0${rawDay}` : `${rawDay}`
    const rand = Math.floor(Math.random() * 31) + 1
    const randomDayNumber = rand < 10 ? `0${rand}` : rand
    const trace = {
      status,
      id: `trace${i}`,
      title: `Ma super trace numéro ${i}`,
      createdAt: `2025-06-${dayNumber}T10:42:00.000Z`,
      updatedAt: `2025-06-${dayNumber}T11:42:00.000Z`,
      willBeDeletedAt: `2026-07-${randomDayNumber}T10:42:00.000Z`
    }
    mockedTraces.push(trace)
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedTraces = mockedTraces.slice(start, end)
  const totalPages = Math.ceil(totalElements / pageSize)

  return {
    data: paginatedTraces,
    page: { pageSize, totalElements, totalPages, page }
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

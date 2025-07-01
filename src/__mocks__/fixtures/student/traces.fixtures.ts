import {
  type TraceConfigurationInfo,
  TraceStatus,
  type TracesViewResponse,
  type TraceViewDTO,
  type UnassociatedTracesSummaryDTO
} from '@/api/avenir-esr'

export const mockedUnassignedTracesSummary: UnassociatedTracesSummaryDTO = {
  total: 20,
  totalWarnings: 5,
  totalCriticals: 2,
}

export const createDeletedTraceIdMock = (traceId: string) => `${traceId}-deleted`

export const invalidTraceId = 'invalid-trace-id'

export function createMockedTracesViewResponse (pageSize: number, totalElements: number, number: number, status: TraceStatus = TraceStatus.UNASSOCIATED): TracesViewResponse {
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
      deletionDate: `2026-07-${randomDayNumber}T10:42:00.000Z`
    }
    mockedTraces.push(trace)
  }

  const start = number * pageSize
  const end = start + pageSize
  const paginatedTraces = mockedTraces.slice(start, end)
  const totalPages = Math.ceil(totalElements / pageSize)

  return {
    data: { traces: paginatedTraces },
    page: { pageSize, totalElements, totalPages, number }
  }
}

export const mockedTracesConfiguration: TraceConfigurationInfo = {
  maxDayRemaining: 30,
  maxDayRemainingWarning: 15,
  maxDayRemainingCritical: 7,
}

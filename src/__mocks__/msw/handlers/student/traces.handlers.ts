import {
  createDeletedTraceIdMock,
  createMockedAttachmentUploadResponse,
  createMockedTraceCreationResponse,
  createMockedTracesViewResponse,
  invalidTraceId,
  mockedTraceDetailed,
  mockedTraceOverview,
  mockedTracesConfiguration,
  mockedTracesSummary
} from '@/__mocks__/fixtures/student'
import { createMockedSearchStudentSkillsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import {
  type AttachmentUploadDTO,
  type CreateTraceDTO,
  EErrorCode,
  ETraceAssociationType,
  getCreateTraceUrl,
  getDeleteTraceAssociationsUrl,
  getGetTraceAssociationsUrl,
  getGetTraceConfigUrl,
  getGetTraceOverviewUrl,
  getGetTracesSummaryUrl,
  getTracesViewUrl,
  getUpdateTraceUrl,
  type PagedResponseTraceAssociationSearchResult,
  type PagedResponseTraceViewDTO,
  type TraceAssociationsDTO,
  type TraceConfigurationDTO,
  type TraceDetailDTO,
  type TraceFilter,
  type TraceOverviewDTO,
  type TracesCreationResponse,
  type TracesSummaryDTO,
  type TracesViewParams,
  type UpdateTraceDTO
} from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { delay, http, HttpResponse, type PathParams } from 'msw'

export function createTracesSummaryHandler (payload: TracesSummaryDTO) {
  return http.get(`*${getGetTracesSummaryUrl()}`, () => {
    return HttpResponse.json<TracesSummaryDTO>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export function createTracesViewHandler (payload: PagedResponseTraceViewDTO) {
  return http.post(`*${getTracesViewUrl()}`, () => {
    return HttpResponse.json<PagedResponseTraceViewDTO>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export function createTraceDetailedHandler (payload: TraceDetailDTO) {
  return http.get<PathParams, TraceDetailDTO>(`*/me/traces/:traceId/detail`, () => {
    return HttpResponse.json<TraceDetailDTO>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export function createTraceOverviewHandler () {
  return http.get<PathParams, TraceOverviewDTO[]>(`*${getGetTraceOverviewUrl()}`, () => {
    return HttpResponse.json<TraceOverviewDTO[]>(mockedTraceOverview, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export const traceOverviewErrorHandler = http.get(`*${getGetTraceOverviewUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
  )
})

export const tracesHandlers = [
  http.get(`*${getGetTracesSummaryUrl()}`, () => {
    return HttpResponse.json<TracesSummaryDTO>(mockedTracesSummary, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.delete(`*/me/traces/:traceId`, ({ params }) => {
    const traceId: string | undefined = params.traceId as string | undefined

    if (!traceId) {
      return HttpResponse.json({ error: 'Trace ID is required' }, { status: 400 })
    }

    if (traceId === invalidTraceId) {
      return HttpResponse.json({ error: 'Trace not found' }, { status: 404 })
    }

    return HttpResponse.json<string>(createDeletedTraceIdMock(traceId), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.post(`*${getTracesViewUrl()}`, async ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const traceFilter = await request.json() as TraceFilter

    const pageSize = Number(searchParams.get('pageSize') ?? PageSizes.FOUR)
    const page = Number(searchParams.get('page') ?? 0)
    const keyword: string | null = searchParams.get('keyword')
    const fromDate: string | null = searchParams.get('fromDate')
    const toDate: string | null = searchParams.get('toDate')

    const tracesViewParams: TracesViewParams = {
      keyword: keyword ?? undefined,
      page,
      pageSize,
      fromDate: fromDate ?? undefined,
      toDate: toDate ?? undefined
    }

    const response: PagedResponseTraceViewDTO = createMockedTracesViewResponse(
      traceFilter ?? {},
      tracesViewParams,
      20
    )
    return HttpResponse.json<PagedResponseTraceViewDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get(`*${getGetTraceConfigUrl()}`, () => {
    return HttpResponse.json<TraceConfigurationDTO>(mockedTracesConfiguration, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.post(`*${getCreateTraceUrl()}`, async ({ request }) => {
    const createTraceDTO = await request.json() as CreateTraceDTO

    if (!createTraceDTO.title || createTraceDTO.title.trim() === '') {
      return HttpResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (createTraceDTO.title === 'ERROR_TRACE') {
      return HttpResponse.json(
        { error: 'Internal server error', message: 'Failed to create trace' },
        { status: 500 }
      )
    }

    const response = createMockedTraceCreationResponse(createTraceDTO.title)
    return HttpResponse.json<TracesCreationResponse>(response, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.post(`*/me/storage/traces/:traceId`, async ({ params, request }) => {
    const traceId: string | undefined = params.traceId as string | undefined

    if (!traceId) {
      return HttpResponse.json({ error: 'Trace ID is required' }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return HttpResponse.json({ error: 'File is required' }, { status: 400 })
    }

    const response = createMockedAttachmentUploadResponse(traceId, file)
    return HttpResponse.json<AttachmentUploadDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get<PathParams, TraceDetailDTO>(`*/me/traces/:traceId/detail`, async () => {
    await delay(100)
    return HttpResponse.json(mockedTraceDetailed, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get<PathParams, PagedResponseTraceAssociationSearchResult>(`*/me/traces/search-association/:associationType`, ({ params, request }) => {
    const { associationType } = params
    const associationTypeParam: ETraceAssociationType | undefined = typeof associationType === 'string' && isEnumMember(ETraceAssociationType, associationType) ? associationType : undefined
    if (!associationTypeParam || !associationTypeParam?.includes(ETraceAssociationType.SKILL_LEVEL)) {
      return HttpResponse.json({ error: 'Invalid or missing association type' }, { status: 400 })
    }
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const keyword = searchParams.get('keyword') ?? ''

    const pageSize = Number(searchParams.get('pageSize') ?? PageSizes.FOUR)
    const page = Number(searchParams.get('page') ?? 0)
    const response = createMockedSearchStudentSkillsDTO(pageSize, 20, page, keyword)

    return HttpResponse.json<PagedResponseTraceAssociationSearchResult>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.post(`*/me/traces/associate/:traceId`, async ({ params }) => {
    const traceId: string | undefined = params.traceId as string | undefined

    if (!traceId) {
      return HttpResponse.json({ error: 'Trace ID is required' }, { status: 400 })
    }

    return HttpResponse.json({ message: 'Ok' }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.put(`*${getUpdateTraceUrl(':traceId')}`, async ({ params, request }) => {
    const traceId: string | undefined = params.traceId as string | undefined

    if (!traceId) {
      return HttpResponse.json({ error: 'Trace ID is required' }, { status: 400 })
    }

    if (traceId === invalidTraceId) {
      return HttpResponse.json({ error: 'Trace not found' }, { status: 404 })
    }

    const updateTraceDTO = await request.json() as UpdateTraceDTO

    if (!updateTraceDTO.title || updateTraceDTO.title.trim() === '') {
      return HttpResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (updateTraceDTO.title === 'ERROR_TRACE') {
      return HttpResponse.json(
        { error: 'Internal server error', message: 'Failed to update trace' },
        { status: 500 }
      )
    }

    const response: TraceDetailDTO = {
      ...mockedTraceDetailed,
      id: traceId,
      title: updateTraceDTO.title,
      personalNote: updateTraceDTO.personalNote || mockedTraceDetailed.personalNote,
      isGroup: updateTraceDTO.isGroup,
      aiUseJustification: updateTraceDTO.iaJustification || mockedTraceDetailed.aiUseJustification,
      updatedAt: new Date().toISOString()
    }

    return HttpResponse.json<TraceDetailDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get<PathParams, TraceDetailDTO>(`*${getGetTraceOverviewUrl()}`, async () => {
    await delay(100)
    return HttpResponse.json(mockedTraceOverview, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get(
    `*${getGetTraceAssociationsUrl(':traceId')}`,
    ({ params }) => {
      const { traceId } = params
      if (traceId === 'INVALID_TRACE_ID') {
        return HttpResponse.json(
          { code: EErrorCode.TRACE_NOT_FOUND, message: 'Trace not found' },
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        )
      }

      return HttpResponse.json({
        declaredActivityAssociations: [],
        declaredSkillAssociations: []
      } as TraceAssociationsDTO)
    }
  ),

  http.delete(
    `*${getDeleteTraceAssociationsUrl(':traceId')}`,
    ({ params }) => {
      const traceId = params.traceId as string

      if (!traceId) {
        return HttpResponse.json({ error: 'Trace ID is required' }, { status: 400 })
      }

      if (traceId === invalidTraceId) {
        return HttpResponse.json({ error: 'Trace not found' }, { status: 404 })
      }

      return HttpResponse.json<string>(createDeletedTraceIdMock(traceId), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  )
]

export const deleteTraceAssociationsErrorHandler = http.delete(
  `*${getDeleteTraceAssociationsUrl(':traceId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
)

import {
  createDeletedTraceIdMock,
  createMockedAttachmentUploadResponse,
  createMockedTraceCreationResponse,
  createMockedTracesViewResponse,
  invalidTraceId,
  mockedLockedDeclaredActivities,
  mockedTraceDetailed,
  mockedTraceOverview,
  mockedTracesConfiguration,
  mockedTracesSummary
} from '@/__mocks__/fixtures/student'
import { isEmptyDataSetRequest } from '@/__mocks__/msw/utils'
import {
  type CreateTraceDTO,
  type FileDTO,
  getCreateTraceUrl,
  getDeleteTracesUrl,
  getDownloadAttachmentUrl,
  getGetLockedDeclaredActivitiesUrl,
  getGetTraceConfigUrl,
  getGetTraceDetailUrl,
  getGetTraceOverviewUrl,
  getGetTracesSummaryUrl,
  getTracesViewUrl,
  getUpdateTraceUrl,
  getUploadAttachmentUrl,
  type PagedResponseTraceViewDTO,
  type TraceConfigurationDTO,
  type TraceDetailDTO,
  type TraceFilter,
  type TraceLockedDeclaredActivitiesDTO,
  type TraceOverviewDTO,
  type TracesCreationResponse,
  type TracesSummaryDTO,
  type TracesViewParams,
  type UpdateTraceDTO
} from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'
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

export const tracesSummaryErrorHandler = http.get(`*${getGetTracesSummaryUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export function createTracesViewHandler (
  payload: PagedResponseTraceViewDTO,
  onRequest?: (traceFilter: TraceFilter, params: TracesViewParams) => void
) {
  return http.post(`*${getTracesViewUrl()}`, async ({ request }) => {
    if (onRequest) {
      const traceFilter = await request.json() as TraceFilter
      const searchParams = new URL(request.url).searchParams
      onRequest(traceFilter, {
        keyword: searchParams.get('keyword') ?? undefined,
        page: searchParams.has('page') ? Number(searchParams.get('page')) : undefined,
        pageSize: searchParams.has('pageSize') ? Number(searchParams.get('pageSize')) : undefined,
        fromDate: searchParams.get('fromDate') ?? undefined,
        toDate: searchParams.get('toDate') ?? undefined,
      })
    }

    return HttpResponse.json<PagedResponseTraceViewDTO>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export function createTraceDetailedHandler (payload: TraceDetailDTO) {
  return http.get<PathParams, TraceDetailDTO>(`*${getGetTraceDetailUrl(':traceId')}`, () => {
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
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const updateTraceErrorHandler = http.put(`*${getUpdateTraceUrl(':traceId')}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: 500 }
  )
})

export function createLockedDeclaredActivitiesHandler (
  payload: TraceLockedDeclaredActivitiesDTO[]
) {
  return http.post(`*${getGetLockedDeclaredActivitiesUrl()}`, () => {
    return HttpResponse.json<TraceLockedDeclaredActivitiesDTO[]>(
      payload,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  })
}

export const lockedDeclaredActivitiesHandler
  = createLockedDeclaredActivitiesHandler([
    {
      traceId: mockedTraceDetailed.id,
      traceTitle: mockedTraceDetailed.title,
      lockedDeclaredActivities: mockedLockedDeclaredActivities
    }
  ])

export const getTraceConfigErrorHandler = http.get(`*${getGetTraceConfigUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
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

  http.delete(`*${getDeleteTracesUrl()}`, async ({ request }) => {
    const traceIds = await request.json() as string[]

    if (!traceIds?.length) {
      return HttpResponse.json(
        { error: 'Trace ID is required', code: ErrorCodes.NOT_BLANK },
        { status: 400 }
      )
    }

    if (traceIds.includes(invalidTraceId)) {
      return HttpResponse.json(
        { error: 'Trace not found', code: ErrorCodes.TRACE_NOT_FOUND },
        { status: 404 }
      )
    }

    return HttpResponse.json<string>(
      createDeletedTraceIdMock(traceIds[0]),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
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
      return HttpResponse.json({ error: 'Title is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (createTraceDTO.title === 'ERROR_TRACE') {
      return HttpResponse.json(
        { error: 'Internal server error', code: ErrorCodes.SERVER },
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

  http.post(`*${getUploadAttachmentUrl(':traceId')}`, async ({ params, request }) => {
    const traceId: string | undefined = params.traceId as string | undefined

    if (!traceId) {
      return HttpResponse.json({ error: 'Trace ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return HttpResponse.json({ error: 'File is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    const response = createMockedAttachmentUploadResponse(traceId, file)
    return HttpResponse.json<FileDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get<PathParams, TraceDetailDTO>(`*${getGetTraceDetailUrl(':traceId')}`, async () => {
    await delay(100)
    return HttpResponse.json(mockedTraceDetailed, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.put(`*${getUpdateTraceUrl(':traceId')}`, async ({ params, request }) => {
    const traceId: string | undefined = params.traceId as string | undefined

    if (!traceId) {
      return HttpResponse.json({ error: 'Trace ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (traceId === invalidTraceId) {
      return HttpResponse.json({ error: 'Trace not found', code: ErrorCodes.TRACE_NOT_FOUND }, { status: 404 })
    }

    const updateTraceDTO = await request.json() as UpdateTraceDTO

    if (!updateTraceDTO.title || updateTraceDTO.title.trim() === '') {
      return HttpResponse.json({ error: 'Title is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (updateTraceDTO.title === 'ERROR_TRACE') {
      return HttpResponse.json(
        { error: 'Internal server error', code: ErrorCodes.SERVER },
        { status: 500 }
      )
    }

    const response: TraceDetailDTO = {
      ...mockedTraceDetailed,
      id: traceId,
      title: updateTraceDTO.title,
      personalNote: updateTraceDTO.personalNote || mockedTraceDetailed.personalNote,
      authorType: updateTraceDTO.authorType,
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

  http.get<PathParams, TraceDetailDTO>(`*${getGetTraceOverviewUrl()}`, async ({ request }) => {
    await delay(100)
    if (isEmptyDataSetRequest(request)) {
      return HttpResponse.json([], {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return HttpResponse.json(mockedTraceOverview, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  lockedDeclaredActivitiesHandler,
]

export const tracesViewErrorHandler = http.post(
  `*${getTracesViewUrl()}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      { status: 500 }
    )
  }
)

export const downloadTraceAttachmentErrorHandler = http.get(
  `*${getDownloadAttachmentUrl(':traceId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      { status: 500 }
    )
  }
)

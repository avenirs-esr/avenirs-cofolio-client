import {
  createDeletedTraceIdMock,
  createMockedAttachmentUploadResponse,
  createMockedSearchActivitiesForAssociationResponse,
  createMockedSearchSkillsForAssociationResponse,
  createMockedTraceCreationResponse,
  createMockedTracesViewResponse,
  invalidTraceId,
  mockedTraceAssociations,
  mockedTraceDetailed,
  mockedTraceOverview,
  mockedTracesConfiguration,
  mockedTracesSummary
} from '@/__mocks__/fixtures/student'
import {
  type AttachmentUploadDTO,
  type CreateTraceDTO,
  EErrorCode,
  getAssociateTraceWithActivitiesUrl,
  getAssociateTraceWithDeclaredSkillUrl,
  getCreateTraceUrl,
  getDeleteTraceAssociationsUrl,
  getDeleteTraceUrl,
  getGetTraceAssociationsUrl,
  getGetTraceConfigUrl,
  getGetTraceDetailUrl,
  getGetTraceOverviewUrl,
  getGetTracesSummaryUrl,
  getSearchDeclaredActivityForAssociationUrl,
  getSearchDeclaredSkillForAssociationUrl,
  getTracesViewUrl,
  getUpdateTraceUrl,
  getUploadAttachmentUrl,
  type PagedResponseAssociationSearchResultDeclaredActivityDTO,
  type PagedResponseAssociationSearchResultDeclaredSkillIDTO,
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
    { message: 'Internal server error' },
    { status: 500 }
  )
})

export const traceWithoutAssociations = http.get(
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
    })
  }
)

export const tracesHandlers = [
  http.get(`*${getGetTracesSummaryUrl()}`, () => {
    return HttpResponse.json<TracesSummaryDTO>(mockedTracesSummary, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.delete(`*${getDeleteTraceUrl(':traceId')}`, ({ params }) => {
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

  http.post(`*${getUploadAttachmentUrl(':traceId')}`, async ({ params, request }) => {
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

      return HttpResponse.json<TraceAssociationsDTO>(mockedTraceAssociations)
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
  ),

  http.get(`*${getSearchDeclaredActivityForAssociationUrl(':traceId')}`, ({ params, request }) => {
    const traceId = params.traceId as string

    if (!traceId) {
      return HttpResponse.json({ error: 'Trace ID is required' }, { status: 400 })
    }

    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword') ?? undefined
    const page = Number(url.searchParams.get('page') ?? 0)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 100)

    const response = createMockedSearchActivitiesForAssociationResponse({ keyword, page, pageSize })

    return HttpResponse.json<PagedResponseAssociationSearchResultDeclaredActivityDTO>(response, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }),

  http.post(`*${getAssociateTraceWithActivitiesUrl(':traceId')}`, ({ params }) => {
    const traceId = params.traceId as string

    if (!traceId) {
      return HttpResponse.json({ error: 'Trace ID is required' }, { status: 400 })
    }

    if (traceId === invalidTraceId) {
      return HttpResponse.json({ error: 'Trace not found' }, { status: 404 })
    }

    return HttpResponse.json<TraceAssociationsDTO>(mockedTraceAssociations, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }),

  http.get(`*${getSearchDeclaredSkillForAssociationUrl(':traceId')}`, ({ params, request }) => {
    const traceId = params.traceId as string

    if (!traceId) {
      return HttpResponse.json({ error: 'Trace ID is required' }, { status: 400 })
    }

    if (traceId === invalidTraceId) {
      return HttpResponse.json({ error: 'Trace not found' }, { status: 404 })
    }

    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword') ?? undefined
    const page = Number(url.searchParams.get('page') ?? 0)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 100)

    const response = createMockedSearchSkillsForAssociationResponse({ keyword, page, pageSize })

    return HttpResponse.json<PagedResponseAssociationSearchResultDeclaredSkillIDTO>(response, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }),

  http.post(`*${getAssociateTraceWithDeclaredSkillUrl(':traceId')}`, ({ params }) => {
    const traceId = params.traceId as string

    if (!traceId) {
      return HttpResponse.json({ error: 'Trace ID is required' }, { status: 400 })
    }

    if (traceId === invalidTraceId) {
      return HttpResponse.json({ error: 'Trace not found' }, { status: 404 })
    }

    return HttpResponse.json<TraceAssociationsDTO>(mockedTraceAssociations, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  })
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

export const searchActivitiesForAssociationErrorHandler = http.get(
  `*${getSearchDeclaredActivityForAssociationUrl(':traceId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
)

export const associateTraceWithActivitiesErrorHandler = http.post(
  `*${getAssociateTraceWithActivitiesUrl(':traceId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
)

export const searchSkillsForAssociationErrorHandler = http.get(
  `*${getSearchDeclaredSkillForAssociationUrl(':traceId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
)

export const associateTraceWithDeclaredSkillsErrorHandler = http.post(
  `*${getAssociateTraceWithDeclaredSkillUrl(':traceId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
)

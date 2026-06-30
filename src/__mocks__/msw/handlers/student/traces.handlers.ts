import {
  createDeletedTraceIdMock,
  createMockedAttachmentUploadResponse,
  createMockedSearchActivitiesForAssociationResponse,
  createMockedSearchSkillsForAssociationResponse,
  createMockedTraceCreationResponse,
  createMockedTracesViewResponse,
  invalidTraceId,
  mockedLockedDeclaredActivities,
  mockedTraceAssociations,
  mockedTraceDetailed,
  mockedTraceOverview,
  mockedTracesConfiguration,
  mockedTracesSummary
} from '@/__mocks__/fixtures/student'
import { isEmptyDataSetRequest } from '@/__mocks__/msw/utils'
import {
  type CreateTraceDTO,
  EErrorCode,
  EFileCategory,
  type FileDTO,
  getAssociateTraceWithActivitiesUrl,
  getAssociateTraceWithDeclaredExperiencesUrl,
  getAssociateTraceWithDeclaredSkillUrl,
  getCreateTraceUrl,
  getDeleteTraceAssociationsUrl,
  getDeleteTracesUrl,
  getDownloadFileUrl,
  getGetLockedDeclaredActivitiesUrl,
  getGetTraceAssociationsUrl,
  getGetTraceConfigUrl,
  getGetTraceDetailUrl,
  getGetTraceOverviewUrl,
  getGetTracesSummaryUrl,
  getSearchDeclaredActivityForAssociationUrl,
  getSearchDeclaredSkillForAssociationUrl,
  getTracesViewUrl,
  getUpdateTraceUrl,
  getUploadFileUrl,
  type PagedResponseAssociationSearchResultDeclaredActivityDTO,
  type PagedResponseAssociationSearchResultDeclaredSkillIDTO,
  type PagedResponseTraceViewDTO,
  type TraceAssociationsDTO,
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
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
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

  http.post(`*${getUploadFileUrl(EFileCategory.TRACE_ATTACHEMENT, ':traceId')}`, async ({ params, request }) => {
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

  http.get(`*${getDownloadFileUrl(':attachmentId')}`, ({ params }) => {
    const attachmentId: string | undefined = params.attachmentId as string | undefined

    if (!attachmentId) {
      return HttpResponse.json({ error: 'Attachment ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (attachmentId === 'INVALID_ATTACHMENT_ID') {
      return HttpResponse.json({ error: 'Attachment not found', code: ErrorCodes.ATTACHMENT_NOT_FOUND }, { status: 404 })
    }

    return new HttpResponse('trace attachment content', {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="An awesome attachment"'
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
        return HttpResponse.json({ error: 'Trace ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
      }

      if (traceId === invalidTraceId) {
        return HttpResponse.json({ error: 'Trace not found', code: ErrorCodes.TRACE_NOT_FOUND }, { status: 404 })
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
      return HttpResponse.json({ error: 'Trace ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
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
      return HttpResponse.json({ error: 'Trace ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (traceId === invalidTraceId) {
      return HttpResponse.json({ error: 'Trace not found', code: ErrorCodes.TRACE_NOT_FOUND }, { status: 404 })
    }

    return HttpResponse.json<TraceAssociationsDTO>(mockedTraceAssociations, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }),

  http.get(`*${getSearchDeclaredSkillForAssociationUrl(':traceId')}`, ({ params, request }) => {
    const traceId = params.traceId as string

    if (!traceId) {
      return HttpResponse.json({ error: 'Trace ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (traceId === invalidTraceId) {
      return HttpResponse.json({ error: 'Trace not found', code: ErrorCodes.TRACE_NOT_FOUND }, { status: 404 })
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
      return HttpResponse.json({ error: 'Trace ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (traceId === invalidTraceId) {
      return HttpResponse.json({ error: 'Trace not found', code: ErrorCodes.TRACE_NOT_FOUND }, { status: 404 })
    }

    return HttpResponse.json<TraceAssociationsDTO>(mockedTraceAssociations, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }),

  http.post(`*${getAssociateTraceWithDeclaredExperiencesUrl(':traceId')}`, ({ params }) => {
    const traceId = params.traceId as string
    if (!traceId) {
      return HttpResponse.json({ error: 'Trace ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }
    if (traceId === invalidTraceId) {
      return HttpResponse.json({ error: 'Trace not found', code: ErrorCodes.TRACE_NOT_FOUND }, { status: 404 })
    }
    return HttpResponse.json<TraceAssociationsDTO>(mockedTraceAssociations, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }),
  lockedDeclaredActivitiesHandler
]

export const deleteTraceAssociationsErrorHandler = http.delete(
  `*${getDeleteTraceAssociationsUrl(':traceId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      { status: 500 }
    )
  }
)

export const downloadTraceAttachmentErrorHandler = http.get(
  `*${getDownloadFileUrl(':attachmentId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      { status: 500 }
    )
  }
)

export const searchActivitiesForAssociationErrorHandler = http.get(
  `*${getSearchDeclaredActivityForAssociationUrl(':traceId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      { status: 500 }
    )
  }
)

export const associateTraceWithActivitiesErrorHandler = http.post(
  `*${getAssociateTraceWithActivitiesUrl(':traceId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      { status: 500 }
    )
  }
)

export const searchSkillsForAssociationErrorHandler = http.get(
  `*${getSearchDeclaredSkillForAssociationUrl(':traceId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      { status: 500 }
    )
  }
)

export const associateTraceWithDeclaredSkillsErrorHandler = http.post(
  `*${getAssociateTraceWithDeclaredSkillUrl(':traceId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      { status: 500 }
    )
  }
)

export const associateTraceWithDeclaredExperiencesErrorHandler = http.post(
  `*${getAssociateTraceWithDeclaredExperiencesUrl(':traceId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      { status: 500 }
    )
  }
)

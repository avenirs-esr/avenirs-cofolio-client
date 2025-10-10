import {
  createDeletedTraceIdMock,
  createMockedAttachmentUploadResponse,
  createMockedTraceCreationResponse,
  createMockedTracesViewResponse,
  invalidTraceId,
  mockedTraceDetailed,
  mockedTracesConfiguration,
  mockedTracesSummary
} from '@/__mocks__/fixtures/student'
import { createMockedSearchStudentSkillsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import {
  type AttachmentUploadDTO,
  type CreateTraceDTO,
  ETraceAssociationType,
  ETraceStatus,
  getCreateTraceUrl,
  getGetTraceConfigUrl,
  getGetTracesSummaryUrl,
  getGetTracesViewUrl,
  type PagedResponseTraceAssociationSearchResult,
  type PagedResponseTraceViewDTO,
  type TraceConfigurationDTO,
  type TraceDetailDTO,
  type TracesCreationResponse,
  type TracesSummaryDTO
} from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import isNil from 'lodash-es/isNil'
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
  return http.get(`*${getGetTracesViewUrl()}`, () => {
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

  http.get(`*${getGetTracesViewUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams

    const pageSize = Number(searchParams.get('pageSize') ?? PageSizes.FOUR)
    const page = Number(searchParams.get('page') ?? 0)
    const statusQueryParam: string | null = searchParams.get('status')
    const keyword: string | null = searchParams.get('keyword')
    const status: ETraceStatus = !isNil(statusQueryParam) && Object.values(ETraceStatus).includes(statusQueryParam as ETraceStatus)
      ? ETraceStatus[statusQueryParam as keyof typeof ETraceStatus]
      : ETraceStatus.UNASSOCIATED

    const response: PagedResponseTraceViewDTO = createMockedTracesViewResponse(
      pageSize,
      20,
      page,
      status,
      keyword ?? undefined
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
]

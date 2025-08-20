import {
  createDeletedTraceIdMock,
  createMockedAttachmentUploadResponse,
  createMockedTraceCreationResponse,
  createMockedTracesViewResponse,
  invalidTraceId,
  mockedTracesConfiguration,
  mockedUnassignedTracesSummary
} from '@/__mocks__/fixtures/student'
import {
  type AttachmentUploadDTO,
  type CreateTraceDTO,
  getCreateTraceUrl,
  getGetTraceConfigInfoUrl,
  getGetTracesUnassociatedSummaryUrl,
  getGetTracesViewUrl,
  type TraceConfigurationInfo,
  type TracesCreationResponse,
  TraceStatus,
  type TracesViewResponse,
  type UnassociatedTracesSummaryDTO
} from '@/api/avenir-esr'
import { PageSizes } from '@/ui/config'
import isNil from 'lodash-es/isNil'
import { http, HttpResponse } from 'msw'

export const tracesHandlers = [
  http.get(`*${getGetTracesUnassociatedSummaryUrl()}`, () => {
    return HttpResponse.json<UnassociatedTracesSummaryDTO>(mockedUnassignedTracesSummary, {
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
    const status: TraceStatus = !isNil(statusQueryParam) && Object.values(TraceStatus).includes(statusQueryParam as TraceStatus)
      ? TraceStatus[statusQueryParam as keyof typeof TraceStatus]
      : TraceStatus.UNASSOCIATED

    const response: TracesViewResponse = createMockedTracesViewResponse(pageSize, 20, page, status)
    return HttpResponse.json<TracesViewResponse>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get(`*${getGetTraceConfigInfoUrl()}`, () => {
    return HttpResponse.json<TraceConfigurationInfo>(mockedTracesConfiguration, {
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

]

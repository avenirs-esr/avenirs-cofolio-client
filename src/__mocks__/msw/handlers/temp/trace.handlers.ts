import { http, HttpResponse } from 'msw';
import { getUpdateTraceUrl, getCreateTraceUrl, getDeleteTracesUrl, getUploadAttachmentUrl, getAssociateTraceWithDeclaredSkillUrl, getAssociateTraceWithDeclaredExperiencesUrl, getAssociateTraceWithActivitiesUrl, getTracesViewUrl, getGetLockedDeclaredActivitiesUrl, getSearchDeclaredSkillForAssociationUrl, getSearchDeclaredExperienceForAssociationUrl, getSearchDeclaredActivityForAssociationUrl, getGetTraceDetailUrl, getDownloadAttachmentUrl, getGetTraceAssociationsUrl, getDeleteTraceAssociationsUrl, getGetTracesSummaryUrl, getSearchTracesForAssociationUrl, getGetTraceOverviewUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { TraceDetailDTO, TracesCreationResponse, FileDTO, TraceAssociationsDTO, PagedResponseTraceViewDTO, TraceLockedDeclaredActivitiesDTO, PagedResponseAssociationSearchResultDeclaredSkillIDTO, PagedResponseAssociationSearchResultDeclaredExperienceDTO, PagedResponseAssociationSearchResultDeclaredActivityDTO, TracesSummaryDTO, EAssociationContextType, PagedResponseAssociationSearchResultTraceDTO, TraceOverviewDTO } from '@/api/avenir-esr';

export const traceHandlers = [
  http.put(`*${getUpdateTraceUrl(':traceId')}`, ({ params }) => {
    const { traceId } = params

    return HttpResponse.json<TraceDetailDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getCreateTraceUrl()}`, () => {
    return HttpResponse.json<TracesCreationResponse>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteTracesUrl()}`, () => {
    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getUploadAttachmentUrl(':traceId')}`, async ({ params, request }) => {
    const { traceId } = params
    const formData = await request.formData()
    const file = formData.get('file') as File

    return HttpResponse.json<FileDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getAssociateTraceWithDeclaredSkillUrl(':traceId')}`, ({ params }) => {
    const { traceId } = params

    return HttpResponse.json<TraceAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getAssociateTraceWithDeclaredExperiencesUrl(':traceId')}`, ({ params }) => {
    const { traceId } = params

    return HttpResponse.json<TraceAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getAssociateTraceWithActivitiesUrl(':traceId')}`, ({ params }) => {
    const { traceId } = params

    return HttpResponse.json<TraceAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getTracesViewUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined
    const fromDate = url.searchParams.get('fromDate')
    const toDate = url.searchParams.get('toDate')

    return HttpResponse.json<PagedResponseTraceViewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getGetLockedDeclaredActivitiesUrl()}`, () => {
    return HttpResponse.json<TraceLockedDeclaredActivitiesDTO[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getSearchDeclaredSkillForAssociationUrl(':traceId')}`, ({ params, request }) => {
    const { traceId } = params
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseAssociationSearchResultDeclaredSkillIDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getSearchDeclaredExperienceForAssociationUrl(':traceId')}`, ({ params, request }) => {
    const { traceId } = params
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseAssociationSearchResultDeclaredExperienceDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getSearchDeclaredActivityForAssociationUrl(':traceId')}`, ({ params, request }) => {
    const { traceId } = params
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseAssociationSearchResultDeclaredActivityDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetTraceDetailUrl(':traceId')}`, ({ params }) => {
    const { traceId } = params

    return HttpResponse.json<TraceDetailDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getDownloadAttachmentUrl(':traceId')}`, ({ params }) => {
    const { traceId } = params

    return HttpResponse.json<Blob>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetTraceAssociationsUrl(':traceId')}`, ({ params, request }) => {
    const { traceId } = params
    const url = new URL(request.url)
    const onlyNotCompleted = url.searchParams.get('onlyNotCompleted') === 'true'

    return HttpResponse.json<TraceAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteTraceAssociationsUrl(':traceId')}`, ({ params }) => {
    const { traceId } = params

    return HttpResponse.json<string>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetTracesSummaryUrl()}`, () => {
    return HttpResponse.json<TracesSummaryDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getSearchTracesForAssociationUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const excludeAssociatedWithElementId = url.searchParams.get('excludeAssociatedWithElementId')
    const contextType = url.searchParams.get('contextType') as EAssociationContextType | null
    const isAssociated = url.searchParams.get('isAssociated') === 'true'
    const keyword = url.searchParams.get('keyword')
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseAssociationSearchResultTraceDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetTraceOverviewUrl()}`, () => {
    return HttpResponse.json<TraceOverviewDTO[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];

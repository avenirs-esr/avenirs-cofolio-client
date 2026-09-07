import { http, HttpResponse } from 'msw';
import { getUnpublishActivityUrl, getPublishActivityDraftUrl, getDuplicateActivityUrl, getCreateActivityDraftUrl, getAddDraftFileUrl, getUploadDraftBannerUrl, getDeleteDraftBannerUrl, getCreateDraftFromActivityUrl, getUpdateActivityDraftUrl, getGetActivitiesViewUrl, getGetActivityPresentationUrl, getGetActivityContentUrl, getDownloadActivityFileUrl, getGetActivitiesWithFeedbacksUrl, getGetStaffActivityWorkingSpaceUrl, getGetStaffActivityLibraryUrl, getGetActivityNavigationUrl, getGetLatestActivitiesViewUrl, getDeleteActivityDraftUrl, getDeleteDraftFileUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { CreationResponse, ActivityDraftCreationResponse, FileDTO, ActivityDraftUpdateResponse, EActivityThematic, PagedResponseActivityOverviewDTO, EActivityStatus, ActivityPresentationDTO, ActivityContentDTO, Blob, EFeedbackStatus, PagedResponseActivityItemNavigationDTO, PagedResponseActivityStaffOverviewDTO, ActivityNavigationDTO } from '@/api/avenir-esr';

export const activityHandlers = [
  http.post(`*${getUnpublishActivityUrl(':activityId')}`, ({ params }) => {
    const { activityId } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getPublishActivityDraftUrl(':activityDraftId')}`, ({ params }) => {
    const { activityDraftId } = params

    return HttpResponse.json<CreationResponse>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getDuplicateActivityUrl(':activityId')}`, ({ params }) => {
    const { activityId } = params

    return HttpResponse.json<ActivityDraftCreationResponse>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getCreateActivityDraftUrl()}`, () => {
    return HttpResponse.json<ActivityDraftCreationResponse>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getAddDraftFileUrl(':activityDraftId')}`, async ({ params, request }) => {
    const { activityDraftId } = params
    const formData = await request.formData()
    const file = formData.get('file') as File

    return HttpResponse.json<FileDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getUploadDraftBannerUrl(':activityDraftId')}`, async ({ params, request }) => {
    const { activityDraftId } = params
    const formData = await request.formData()
    const file = formData.get('file') as File

    return HttpResponse.json<FileDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteDraftBannerUrl(':activityDraftId')}`, ({ params }) => {
    const { activityDraftId } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getCreateDraftFromActivityUrl(':activityId')}`, ({ params }) => {
    const { activityId } = params

    return HttpResponse.json<ActivityDraftCreationResponse>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.patch(`*${getUpdateActivityDraftUrl(':activityDraftId')}`, ({ params }) => {
    const { activityDraftId } = params

    return HttpResponse.json<ActivityDraftUpdateResponse>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetActivitiesViewUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined
    const thematic = url.searchParams.get('thematic') as EActivityThematic | null

    return HttpResponse.json<PagedResponseActivityOverviewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetActivityPresentationUrl(':activityStatus' as EActivityStatus, ':activityId')}`, ({ params }) => {
    const { activityStatus, activityId } = params

    return HttpResponse.json<ActivityPresentationDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetActivityContentUrl(':activityStatus' as EActivityStatus, ':activityId')}`, ({ params }) => {
    const { activityStatus, activityId } = params

    return HttpResponse.json<ActivityContentDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getDownloadActivityFileUrl(':activityId', ':fileId')}`, ({ params }) => {
    const { activityId, fileId } = params

    return HttpResponse.json<Blob>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetActivitiesWithFeedbacksUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const statusesParam = url.searchParams.getAll('statuses')
    const statuses = statusesParam.length > 0 ? (statusesParam as EFeedbackStatus[]) : undefined
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseActivityItemNavigationDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetStaffActivityWorkingSpaceUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined
    const status = url.searchParams.get('status') as EActivityStatus | null

    return HttpResponse.json<PagedResponseActivityStaffOverviewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetStaffActivityLibraryUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined
    const thematic = url.searchParams.get('thematic') as EActivityThematic | null

    return HttpResponse.json<PagedResponseActivityStaffOverviewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetActivityNavigationUrl()}`, () => {
    return HttpResponse.json<ActivityNavigationDTO[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetLatestActivitiesViewUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseActivityOverviewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteActivityDraftUrl(':activityDraftId')}`, ({ params }) => {
    const { activityDraftId } = params

    return HttpResponse.json<string>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteDraftFileUrl(':activityDraftId', ':fileId')}`, ({ params }) => {
    const { activityDraftId, fileId } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  })
];

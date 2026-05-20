import type { ActivityContentDTO, ActivityDraftCreationResponse, ActivityDraftUpdateResponse, PagedResponseActivityStaffOverviewDTO } from '@/api/avenir-esr'
import { createMockedPagedResponseActivityStaffOverviewDTO, mockedActivityContent, mockedActivityDraftCreationResponse, mockedActivityDraftUpdateResponse } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { createEmptyPaginatedDatasetResponse, isEmptyDataSetRequest } from '@/__mocks__/msw/utils'
import { EActivityStatus, getCreateActivityDraftUrl, getGetActivityContentUrl, getGetStaffActivityLibraryUrl, getGetStaffActivityWorkingSpaceUrl, getUpdateActivityUrl } from '@/api/avenir-esr'
import { HttpStatusCode } from '@/common/utils/http/http-status'
import { http, HttpResponse } from 'msw'

export const createActivityDraftErrorHandler = http.post(`*${getCreateActivityDraftUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur' },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const getActivityContentErrorHandler = http.get(`*${getGetActivityContentUrl(EActivityStatus.DRAFT, ':activityId')}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur' },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const getStaffActivityWorkingSpaceErrorHandler = http.get(`*${getGetStaffActivityWorkingSpaceUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur' },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const getStaffActivityLibraryErrorHandler = http.get(`*${getGetStaffActivityLibraryUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur' },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const updateActivityErrorHandler = http.patch(`*${getUpdateActivityUrl(EActivityStatus.DRAFT, ':activityId')}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur' },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const staffsActivitiesHandlers = [
  http.get(`*${getGetActivityContentUrl(EActivityStatus.DRAFT, ':activityId')}`, () => {
    return HttpResponse.json<ActivityContentDTO>(mockedActivityContent, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
  http.get(`*${getGetStaffActivityWorkingSpaceUrl()}`, ({ request }) => {
    if (isEmptyDataSetRequest(request)) {
      return createEmptyPaginatedDatasetResponse<PagedResponseActivityStaffOverviewDTO>()
    }

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '12')
    const totalElements = 6

    const mockData = createMockedPagedResponseActivityStaffOverviewDTO(pageSize, totalElements, page)

    return HttpResponse.json<PagedResponseActivityStaffOverviewDTO>(mockData, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
  http.get(`*${getGetStaffActivityLibraryUrl()}`, ({ request }) => {
    if (isEmptyDataSetRequest(request)) {
      return createEmptyPaginatedDatasetResponse<PagedResponseActivityStaffOverviewDTO>()
    }

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '12')
    const totalElements = 6

    const mockData = createMockedPagedResponseActivityStaffOverviewDTO(pageSize, totalElements, page)

    return HttpResponse.json<PagedResponseActivityStaffOverviewDTO>(mockData, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
  http.patch(`*${getUpdateActivityUrl(EActivityStatus.DRAFT, ':activityId')}`, () => {
    return HttpResponse.json<ActivityDraftUpdateResponse>(mockedActivityDraftUpdateResponse, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
  http.post(`*${getCreateActivityDraftUrl()}`, () => {
    return HttpResponse.json<ActivityDraftCreationResponse>(mockedActivityDraftCreationResponse, {
      status: HttpStatusCode.CREATED,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
]

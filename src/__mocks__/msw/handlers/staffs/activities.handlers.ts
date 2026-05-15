import type { ActivityContentDTO, ActivityDraftCreationResponse, ActivityDraftUpdateResponse } from '@/api/avenir-esr'
import { mockedActivityContent, mockedActivityDraftCreationResponse, mockedActivityDraftUpdateResponse } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { EActivityStatus, getCreateActivityDraftUrl, getGetActivityContentUrl, getUpdateActivityUrl } from '@/api/avenir-esr'
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

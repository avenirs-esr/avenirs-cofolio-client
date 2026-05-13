import type { ActivityDraftCreationResponse } from '@/api/avenir-esr'
import { mockedActivityDraftCreationResponse } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { getCreateActivityDraftUrl } from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'

export const createActivityDraftErrorHandler = http.post(`*${getCreateActivityDraftUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur' },
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  )
})

export const staffsActivitiesHandlers = [
  http.post(`*${getCreateActivityDraftUrl()}`, () => {
    return HttpResponse.json<ActivityDraftCreationResponse>(mockedActivityDraftCreationResponse, {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
]

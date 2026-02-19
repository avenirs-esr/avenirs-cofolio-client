import { activitiesNavigationMock } from '@/__mocks__/fixtures/student/activities.fixtures'
import { mockedActivityDetail } from '@/__mocks__/fixtures/student/project-activities.fixtures'
import {
  type ActivityDetailDTO,
  type ActivityNavigationDTO,
  getGetActivityDetailUrl,
  getGetActivityNavigationUrl,
  getUnsubscribeActivityProgressesUrl,
} from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'

export const activityDetailsErrorHandler = http.get(`*${getGetActivityDetailUrl(':activityId')}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error' },
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
})

export const activityNavigationQueryError = http.get(`*${getGetActivityNavigationUrl()}`, async () => {
  return HttpResponse.json(
    { message: 'Internal Server Error' },
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  )
})

export const activityNavigationQuery = http.get(`*${getGetActivityNavigationUrl()}`, async () => {
  return HttpResponse.json<ActivityNavigationDTO[]>(activitiesNavigationMock, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  })
})

const unsubscribeActivityProgressesHandler = http.post(`*${getUnsubscribeActivityProgressesUrl()}`, async ({ request }) => {
  const activitiesIds = await request.json() as string[]

  if (activitiesIds.length === 0) {
    return HttpResponse.json({ error: 'No activity IDs provided' }, { status: 400 })
  }

  if (activitiesIds.find(id => id === 'INVALID_ACTIVITY_ID')) {
    return HttpResponse.json({ error: 'Invalid activity ID' }, { status: 400 })
  }

  const response = 'Activities successfully unsubscribed from user'
  return HttpResponse.json<string>(response, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  })
})

export const activitiesHandlers = [
  activityNavigationQuery,
  http.get(`*${getGetActivityDetailUrl(':activityId')}`, async ({ params }) => {
    const { activityId } = params

    if (activityId === 'INVALID_ACTIVITY_ID') {
      return HttpResponse.json(
        { code: 'ACTIVITY_NOT_FOUND', message: 'Activity not found' },
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    return HttpResponse.json<ActivityDetailDTO>(mockedActivityDetail, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),
  unsubscribeActivityProgressesHandler,
]

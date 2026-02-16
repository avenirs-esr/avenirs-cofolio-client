import { mockedActivityDetail } from '@/__mocks__/fixtures/student/project-activities.fixtures'
import {
  type ActivityDetailDTO,
  getGetActivityDetailUrl,
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

export const activitiesHandlers = [
  http.get(`*${getGetActivityDetailUrl(':activityId')}`, async ({ params }) => {
    const { activityId } = params

    if (activityId === 'INVALID_ACTIVITY_ID') {
      return HttpResponse.json(
        { message: 'Activity not found' },
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
]

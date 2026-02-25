import {
  activitiesNavigationMock,
  createLargeMockedPagedResponseDeclaredActivityViewDTO,
  createMockedPagedResponseDeclaredActivityViewDTO,
  mockedActivityDetail,
  mockedDeclaredActivity
} from '@/__mocks__/fixtures/student/activities.fixtures'
import {
  type ActivityDetailDTO,
  type ActivityNavigationDTO,
  type DeclaredActivity,
  EErrorCode,
  getGetActivitiesViewUrl,
  getGetActivityDetailUrl,
  getGetActivityNavigationUrl,
  getGetDeclaredActivitiesViewUrl,
  getSubscribeUrl,
  getUnsubscribeUrl,
  type PagedResponseDeclaredActivityViewDTO,
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

const subscribeActivityProgressHandler = http.post(`*${getSubscribeUrl(':activityId')}`, async ({ params }) => {
  const { activityId } = params

  if (activityId === 'INVALID_ACTIVITY_ID') {
    return HttpResponse.json({ error: 'Invalid activity ID' }, { status: 400 })
  }

  return HttpResponse.json<DeclaredActivity>(mockedDeclaredActivity, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  })
})

const unsubscribeActivityProgressHandler = http.delete(`*${getUnsubscribeUrl()}`, async ({ request }) => {
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

export const libraryActivitiesErrorHandler = http.get(`*${getGetDeclaredActivitiesViewUrl()}`, () => {
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

export const largeLibraryActivitiesHandler = http.get(`*${getGetDeclaredActivitiesViewUrl()}`, ({ request }) => {
  const url = new URL(request.url)
  const page = Number.parseInt(url.searchParams.get('page') ?? '0')
  const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '10')

  const mockData = createLargeMockedPagedResponseDeclaredActivityViewDTO(pageSize, page)

  return HttpResponse.json<PagedResponseDeclaredActivityViewDTO>(mockData, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

export const activityDetailHandler = http.get(`*${getGetActivityDetailUrl(':activityId')}`, async ({ params }) => {
  const { activityId } = params

  if (activityId === 'INVALID_ACTIVITY_ID') {
    return HttpResponse.json(
      { code: EErrorCode.ACTIVITY_NOT_FOUND, message: 'Activity not found' },
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  if (activityId === 'SUBSCRIBED_ACTIVITY_ID') {
    return HttpResponse.json<ActivityDetailDTO>({ ...mockedActivityDetail, isSubscribed: true }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  return HttpResponse.json<ActivityDetailDTO>(mockedActivityDetail, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

export const activitiesViewHandler = http.get(
  `*${getGetActivitiesViewUrl()}`,
  async ({ request }) => {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '4')
    const totalElements = 6
    await delay('real')

    const mockData = createMockedPagedResponseDeclaredActivityViewDTO(
      pageSize,
      totalElements,
      page
    )

    return HttpResponse.json<PagedResponseDeclaredActivityViewDTO>(mockData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
)

export const activitiesViewErrorHandler = http.get(
  `*${getGetActivitiesViewUrl()}`,
  async () => {
    return HttpResponse.json(
      { message: 'Internal Server Error' },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
)

export const activitiesHandlers = [
  http.get(`*${getGetDeclaredActivitiesViewUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '10')
    const totalElements = 6

    const mockData = createMockedPagedResponseDeclaredActivityViewDTO(pageSize, totalElements, page)

    return HttpResponse.json<PagedResponseDeclaredActivityViewDTO>(mockData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),
  activityNavigationQuery,
  activitiesViewHandler,
  activityDetailHandler,
  subscribeActivityProgressHandler,
  unsubscribeActivityProgressHandler,
]

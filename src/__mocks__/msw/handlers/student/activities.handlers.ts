import {
  activitiesNavigationMock,
  createLargeMockedPagedResponseDeclaredActivityViewDTO,
  createMockedPagedResponseDeclaredActivityViewDTO,
  mockedActivityDetail,
  mockedDeclaredActivity,
  mockedDeclaredActivityDetails,
  mockedFinishedDeclaredActivityDetails
} from '@/__mocks__/fixtures/student/activities.fixtures'
import { createEmptyPaginatedDatasetResponse, isEmptyDataSetRequest } from '@/__mocks__/msw/utils'
import {
  type ActivityDetailDTO,
  type ActivityNavigationDTO,
  type DeclaredActivity,
  type DeclaredActivityDetailsDTO,
  EErrorCode,
  getFinishUrl,
  getGetActivitiesViewUrl,
  getGetActivityDetailUrl,
  getGetActivityNavigationUrl,
  getGetDeclaredActivitiesViewUrl,
  getGetDeclaredActivityDetailsUrl,
  getGetLatestActivitiesViewUrl,
  getSubscribeActivityUrl,
  getUnsubscribeActivitiesProgressesUrl,
  type PagedResponseDeclaredActivityViewDTO,
} from '@/api/avenir-esr'
import { delay, http, HttpResponse } from 'msw'

const subscribedActivities = new Set<string>()

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

const subscribeActivityProgressHandler = http.post(`*${getSubscribeActivityUrl(':activityId')}`, async ({ params }) => {
  const { activityId } = params
  if (activityId === 'INVALID_ACTIVITY_ID') {
    return HttpResponse.json({ error: 'Invalid activity ID' }, { status: 400 })
  }
  subscribedActivities.add(activityId as string)
  return HttpResponse.json<DeclaredActivity>(mockedDeclaredActivity, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

const unsubscribeActivityProgressHandler = http.delete(`*${getUnsubscribeActivitiesProgressesUrl()}`, async ({ request }) => {
  const activitiesIds = await request.json() as string[]
  if (activitiesIds.length === 0) {
    return HttpResponse.json({ error: 'No activity IDs provided' }, { status: 400 })
  }
  if (activitiesIds.find(id => id === 'INVALID_ACTIVITY_ID')) {
    return HttpResponse.json({ error: 'Invalid activity ID' }, { status: 400 })
  }

  activitiesIds.forEach(id => subscribedActivities.delete(id))

  const response = 'Activities successfully unsubscribed from user'
  return HttpResponse.json<string>(response, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
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
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return HttpResponse.json<ActivityDetailDTO>({ ...mockedActivityDetail, id: activityId as string }, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

export const declaredActivityDetailsHandler = http.get(`*${getGetDeclaredActivityDetailsUrl(':declaredActivityId')}`, async ({ params }) => {
  const { declaredActivityId } = params

  if (declaredActivityId === 'INVALID_DECLARED_ACTIVITY_ID') {
    return HttpResponse.json(
      { code: EErrorCode.ACTIVITY_NOT_FOUND, message: 'Declared activity not found' },
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  return HttpResponse.json<DeclaredActivityDetailsDTO>(mockedDeclaredActivityDetails, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

export const declaredActivityDetailsErrorHandler = http.get(`*${getGetDeclaredActivityDetailsUrl(':declaredActivityId')}`, () => {
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

export const latestActivitiesHandler = http.get(
  `*${getGetLatestActivitiesViewUrl()}`,
  async ({ request }) => {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '3')
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

export const latestActivitiesErrorHandler = http.get(
  `*${getGetLatestActivitiesViewUrl()}`,
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

export const finishDeclaredActivityHandler = http.put(`*${getFinishUrl(':declaredActivityId')}`, async ({ params }) => {
  const { declaredActivityId } = params

  if (declaredActivityId === 'INVALID_DECLARED_ACTIVITY_ID') {
    return HttpResponse.json(
      { code: EErrorCode.ACTIVITY_NOT_FOUND, message: 'Declared activity not found' },
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  return HttpResponse.json<DeclaredActivityDetailsDTO>(mockedFinishedDeclaredActivityDetails, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

export const finishDeclaredActivityErrorHandler = http.put(`*${getFinishUrl(':declaredActivityId')}`, () => {
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
  http.get(`*${getGetDeclaredActivitiesViewUrl()}`, ({ request }) => {
    if (isEmptyDataSetRequest(request)) {
      return createEmptyPaginatedDatasetResponse<PagedResponseDeclaredActivityViewDTO>()
    }

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
  latestActivitiesHandler,
  activityDetailHandler,
  declaredActivityDetailsHandler,
  subscribeActivityProgressHandler,
  unsubscribeActivityProgressHandler,
  finishDeclaredActivityHandler,
]

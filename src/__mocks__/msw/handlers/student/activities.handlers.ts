import {
  activitiesNavigationMock,
  createLargeMockedPagedResponseDeclaredActivityViewDTO,
  createMockedDeclaredActivityAssociationsDTO,
  createMockedDeclaredActivityDetails,
  createMockedPagedResponseAssociationSearchResultDeclaredActivityDTO,
  createMockedPagedResponseDeclaredActivityViewDTO,
  mockedActivityDetail,
  mockedDeclaredActivitiesOverview,
  mockedDeclaredActivityAssociations,
  mockedDeclaredActivityDetails,
  mockedFinishedDeclaredActivityDetails,
  mockedLatestActivitiesOverview
} from '@/__mocks__/fixtures/student/activities.fixtures'
import { createMockedSearchTracesForAssociationWithDeclaredExperienceResponse } from '@/__mocks__/fixtures/student/traces.fixtures'
import { createEmptyPaginatedDatasetResponse, isEmptyDataSetRequest } from '@/__mocks__/msw/utils'
import {
  type ActivityNavigationDTO,
  type ActivityPresentationDTO,
  type AssociationsCreationRequest,
  type DeclaredActivityAssociationsDTO,
  type DeclaredActivityDetailsDTO,
  EActivityStatus,
  EDeclaredActivityStatus,
  EErrorCode,
  getAskForFeedbackUrl,
  getAssociateActivityWithDeclaredSkillsUrl,
  getAssociateActivityWithTracesUrl,
  getDeleteDeclaredActivityAssociationsUrl,
  getFinishUrl,
  getGetActivitiesViewUrl,
  getGetActivityNavigationUrl,
  getGetActivityPresentationUrl,
  getGetDeclaredActivitiesViewUrl,
  getGetDeclaredActivityAssociationsUrl,
  getGetDeclaredActivityDetailsUrl,
  getGetLatestActivitiesViewUrl,
  getSearchDeclaredActivitiesForAssociationUrl,
  getSearchTracesForAssociationWithDeclaredActivityUrl,
  getSubscribeActivityUrl,
  getUnsubscribeActivitiesProgressesUrl,
  getUpdateDeclaredActivityUrl,
  getUpdateReflectionUrl,
  type PagedResponseActivityOverviewDTO,
  type PagedResponseAssociationSearchResultDeclaredActivityDTO,
  type PagedResponseAssociationSearchResultTraceDTO,
  type PagedResponseDeclaredActivityViewDTO,
} from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { PERSPECTIVE_MAX_LENGTH } from '@/features/buildProject/views/ProjectActivityDetailedView/components/cards/MyPerspectiveCard/config'
import { delay, http, HttpResponse, type PathParams } from 'msw'

const subscribedActivities = new Set<string>()
const declaredActivityDetailsOverrides = new Map<string, Partial<DeclaredActivityDetailsDTO>>()

export const activityDetailsErrorHandler = http.get(`*${getGetActivityPresentationUrl(EActivityStatus.PUBLISHED, ':activityId')}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
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
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
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
    return HttpResponse.json({ error: 'Invalid activity ID', code: ErrorCodes.ACTIVITY_NOT_FOUND }, { status: 404 })
  }
  subscribedActivities.add(activityId as string)
  return HttpResponse.json<DeclaredActivityDetailsDTO>(mockedDeclaredActivityDetails, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

const unsubscribeActivityProgressHandler = http.delete(`*${getUnsubscribeActivitiesProgressesUrl()}`, async ({ request }) => {
  const activitiesIds = await request.json() as string[]
  if (activitiesIds.length === 0) {
    return HttpResponse.json({ error: 'No activity IDs provided', code: ErrorCodes.NOT_BLANK }, { status: 400 })
  }
  if (activitiesIds.find(id => id === 'INVALID_ACTIVITY_ID')) {
    return HttpResponse.json({ error: 'Invalid activity ID', code: ErrorCodes.ACTIVITY_NOT_FOUND }, { status: 404 })
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
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
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
export const activityDetailHandler = http.get(`*${getGetActivityPresentationUrl(EActivityStatus.PUBLISHED, ':activityId')}`, async ({ params }) => {
  const { activityId } = params
  if (activityId === 'INVALID_ACTIVITY_ID') {
    return HttpResponse.json(
      { code: EErrorCode.ACTIVITY_NOT_FOUND, message: 'Activity not found' },
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return HttpResponse.json<ActivityPresentationDTO>({ ...mockedActivityDetail, id: activityId as string }, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

export const declaredActivityDetailsHandler = http.get(`*${getGetDeclaredActivityDetailsUrl(':declaredActivityId')}`, async ({ params }) => {
  const declaredActivityId = Array.isArray(params.declaredActivityId)
    ? params.declaredActivityId[0]
    : params.declaredActivityId

  if (!declaredActivityId || declaredActivityId === 'INVALID_DECLARED_ACTIVITY_ID') {
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

  const tempDetails = createMockedDeclaredActivityDetails(declaredActivityId)
  const baseDetails = createMockedDeclaredActivityDetails(declaredActivityId, {
    withFeedback: tempDetails.status === EDeclaredActivityStatus.SUBMITTED,
  })
  const overrides = declaredActivityDetailsOverrides.get(declaredActivityId)

  return HttpResponse.json<DeclaredActivityDetailsDTO>(
    {
      ...baseDetails,
      ...overrides,
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
})

export const declaredActivityAssociationsHandler = http.get(`*${getGetDeclaredActivityAssociationsUrl(':declaredActivityId')}`, async ({ params }) => {
  const { declaredActivityId } = params
  if (declaredActivityId === 'INVALID_DECLARED_ACTIVITY_ID') {
    return HttpResponse.json(
      { code: EErrorCode.ACTIVITY_NOT_FOUND, message: 'Declared activity not found' },
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (declaredActivityId === 'DECLARED_ACTIVITY_WITH_NO_ASSOCIATIONS') {
    return HttpResponse.json<DeclaredActivityAssociationsDTO>({ traceAssociations: [], declaredSkillAssociations: [] }, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return HttpResponse.json<DeclaredActivityAssociationsDTO>(mockedDeclaredActivityAssociations, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

export const declaredActivityDetailsErrorHandler = http.get(`*${getGetDeclaredActivityDetailsUrl(':declaredActivityId')}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
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
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
)

export const latestActivitiesOverviewHandler = http.get(
  `*${getGetLatestActivitiesViewUrl()}`,
  async ({ request }) => {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '3')
    const totalElements = 6
    await delay('real')

    const mockData = {
      data: mockedLatestActivitiesOverview,
      page: {
        page,
        pageSize,
        totalElements,
        totalPages: Math.ceil(totalElements / pageSize)
      }
    }

    return HttpResponse.json<PagedResponseActivityOverviewDTO>(mockData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
)

export const declaredActivitiesOverviewHandler = http.get(
  `*${getGetDeclaredActivitiesViewUrl()}`,
  async ({ request }) => {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '3')
    const totalElements = 6
    await delay('real')

    const mockData = {
      data: mockedDeclaredActivitiesOverview,
      page: {
        page,
        pageSize,
        totalElements,
        totalPages: Math.ceil(totalElements / pageSize)
      }
    }

    return HttpResponse.json<PagedResponseDeclaredActivityViewDTO>(mockData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
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
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
)

export const askForFeedbackHandler = http.post(`*${getAskForFeedbackUrl(':declaredActivityId')}`, async ({ params }) => {
  const declaredActivityId = Array.isArray(params.declaredActivityId)
    ? params.declaredActivityId[0]
    : params.declaredActivityId

  if (!declaredActivityId || declaredActivityId === 'INVALID_DECLARED_ACTIVITY_ID') {
    return HttpResponse.json(
      { code: EErrorCode.ACTIVITY_NOT_FOUND, message: 'Declared activity not found' },
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  return HttpResponse.json({}, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

export const askForFeedbackErrorHandler = http.post(`*${getAskForFeedbackUrl(':declaredActivityId')}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  )
})

export const finishDeclaredActivityHandler = http.put(`*${getFinishUrl(':declaredActivityId')}`, async ({ params }) => {
  const declaredActivityId = Array.isArray(params.declaredActivityId)
    ? params.declaredActivityId[0]
    : params.declaredActivityId

  if (!declaredActivityId || declaredActivityId === 'INVALID_DECLARED_ACTIVITY_ID') {
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

  const baseDetails = createMockedDeclaredActivityDetails(declaredActivityId)

  const updatedDetails: DeclaredActivityDetailsDTO = {
    ...baseDetails,
    ...mockedFinishedDeclaredActivityDetails,
    id: declaredActivityId,
    activity: baseDetails.activity,
    status: baseDetails.status === 'COMPLETED'
      ? baseDetails.status
      : mockedFinishedDeclaredActivityDetails.status,
  }

  declaredActivityDetailsOverrides.set(declaredActivityId, {
    status: updatedDetails.status,
    finishedAt: updatedDetails.finishedAt,
    updatedAt: updatedDetails.updatedAt,
  })

  return HttpResponse.json<DeclaredActivityDetailsDTO>(updatedDetails, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

export const finishDeclaredActivityErrorHandler = http.put(`*${getFinishUrl(':declaredActivityId')}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
})

export const updateActivityHandler = http.patch(`*${getUpdateDeclaredActivityUrl(':declaredActivityId')}`, ({ params }) => {
  const { declaredActivityId } = params

  if (declaredActivityId === 'INVALID_DECLARED_ACTIVITY_ID') {
    return HttpResponse.json(
      { message: 'Declared activity not found' },
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return HttpResponse.json<string>('Activity updated successfully', {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

export const updateActivityReflectionHandler = http.put(`*${getUpdateReflectionUrl(':activityId')}`, async ({ params, request }) => {
  const { reflection } = await request.json() as { reflection: string }
  const { activityId } = params

  if (activityId === 'INVALID_ACTIVITY_ID') {
    return HttpResponse.json(
      { message: 'Activity not found' },
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (reflection === '') {
    return HttpResponse.json(
      { message: 'Reflection cannot be empty' },
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (reflection.length > PERSPECTIVE_MAX_LENGTH) {
    return HttpResponse.json(
      { message: 'Reflection exceeds maximum length' },
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return HttpResponse.json<string>('Reflection updated successfully', {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

export const associateActivityWithTracesHandler = http.post(
  `*${getAssociateActivityWithTracesUrl(':declaredActivityId')}`,
  async ({ params, request }) => {
    const { declaredActivityId } = params

    if (!declaredActivityId || declaredActivityId === 'INVALID_DECLARED_ACTIVITY_ID') {
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

    const { idsToAssociate } = await request.json() as AssociationsCreationRequest

    const response = createMockedDeclaredActivityAssociationsDTO(idsToAssociate)

    return HttpResponse.json<DeclaredActivityAssociationsDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
)

export const associateActivityWithTracesErrorHandler = http.post(
  `*${getAssociateActivityWithTracesUrl(':declaredActivityId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
)

export const associateActivityWithDeclaredSkillsHandler = http.post<PathParams, AssociationsCreationRequest>(
  `*${getAssociateActivityWithDeclaredSkillsUrl(':declaredActivityId')}`,
  async ({ params, request }) => {
    const { declaredActivityId } = params

    if (!declaredActivityId || declaredActivityId === 'INVALID_DECLARED_ACTIVITY_ID') {
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

    const { idsToAssociate } = await request.json()

    const response = createMockedDeclaredActivityAssociationsDTO(idsToAssociate)

    return HttpResponse.json<DeclaredActivityAssociationsDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
)

export const associateActivityWithDeclaredSkillsErrorHandler = http.post(
  `*${getAssociateActivityWithDeclaredSkillsUrl(':declaredActivityId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
)

export const deleteDeclaredActivityAssociationsSuccessHandler = http.delete(
  `*${getDeleteDeclaredActivityAssociationsUrl(':declaredActivityId')}`,
  async () => {
    return HttpResponse.json('Associations deleted successfully', { status: 200 })
  }
)

export const deleteDeclaredActivityAssociationsErrorHandler = http.delete(
  `*${getDeleteDeclaredActivityAssociationsUrl(':declaredActivityId')}`,
  async () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      { status: 500 }
    )
  }
)

export const searchTracesForAssociationHandler = http.get(
  `*${getSearchTracesForAssociationWithDeclaredActivityUrl(':declaredActivityId')}`,
  async ({ params, request }) => {
    const { declaredActivityId } = params

    if (!declaredActivityId || declaredActivityId === 'INVALID_DECLARED_ACTIVITY_ID') {
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

    const url = new URL(request.url)

    const keyword = url.searchParams.get('keyword') ?? undefined
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '20')

    const rawIsAssociated = url.searchParams.get('isAssociated')
    const isAssociated
      = rawIsAssociated === null || rawIsAssociated === 'null'
        ? undefined
        : rawIsAssociated === 'true'

    const response = createMockedSearchTracesForAssociationWithDeclaredExperienceResponse({
      keyword,
      page,
      pageSize,
      isAssociated
    })

    return HttpResponse.json<PagedResponseAssociationSearchResultTraceDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
)

export const searchTracesForAssociationErrorHandler = http.get(
  `*${getSearchTracesForAssociationWithDeclaredActivityUrl(':declaredActivityId')}`,
  async () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
)

export const searchDeclaredActivitiesForAssociationErrorHandler = http.get(
  `*${getSearchDeclaredActivitiesForAssociationUrl()}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      { status: 500 }
    )
  }
)

export const searchDeclaredActivitiesForAssociationHandler = http.get(
  `*${getSearchDeclaredActivitiesForAssociationUrl()}*`,
  ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const keyword = searchParams.get('keyword') ?? ''
    const pageSize = Number(searchParams.get('pageSize') ?? 100)
    const page = Number(searchParams.get('page') ?? 0)

    const response = createMockedPagedResponseAssociationSearchResultDeclaredActivityDTO(
      pageSize,
      page,
      keyword
    )

    return HttpResponse.json<PagedResponseAssociationSearchResultDeclaredActivityDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }
)

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
  searchDeclaredActivitiesForAssociationHandler,
  activityDetailHandler,
  declaredActivityDetailsHandler,
  declaredActivityAssociationsHandler,
  subscribeActivityProgressHandler,
  unsubscribeActivityProgressHandler,
  finishDeclaredActivityHandler,
  updateActivityHandler,
  updateActivityReflectionHandler,
  associateActivityWithTracesHandler,
  associateActivityWithDeclaredSkillsHandler,
  deleteDeclaredActivityAssociationsSuccessHandler,
  searchTracesForAssociationHandler,
  askForFeedbackHandler,
]

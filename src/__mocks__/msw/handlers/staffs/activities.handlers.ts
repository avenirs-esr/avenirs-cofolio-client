import type { ActivityContentDTO, ActivityDraftCreationResponse, ActivityDraftUpdateResponse, ActivityPresentationDTO, CreationResponse, FileDTO, PagedResponseActivityStaffOverviewDTO } from '@/api/avenir-esr'
import { createMockedBannerUploadResponse, createMockedPagedResponseActivityStaffOverviewDTO, mockedActivityContent, mockedActivityDraftCreationResponse, mockedActivityDraftUpdateResponse } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { mockedActivityDetail } from '@/__mocks__/fixtures/student/activities.fixtures'
import { createEmptyPaginatedDatasetResponse, isEmptyDataSetRequest } from '@/__mocks__/msw/utils'
import { EActivityStatus, EErrorCode, EFileCategory, getCreateActivityDraftUrl, getDeleteActivityDraftUrl, getGetActivityContentUrl, getGetActivityPresentationUrl, getGetStaffActivityLibraryUrl, getGetStaffActivityWorkingSpaceUrl, getPublishActivityDraftUrl, getUpdateActivityUrl, getUploadFileUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants/error-codes'
import { HttpStatusCode } from '@/common/utils/http/http-status'
import { http, HttpResponse } from 'msw'

export const createActivityDraftErrorHandler = http.post(`*${getCreateActivityDraftUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const getActivityContentErrorHandler = http.get(`*${getGetActivityContentUrl(EActivityStatus.DRAFT, ':activityId')}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const getPublishedActivityContentErrorHandler = http.get(`*${getGetActivityContentUrl(EActivityStatus.PUBLISHED, ':activityId')}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const getStaffActivityWorkingSpaceErrorHandler = http.get(`*${getGetStaffActivityWorkingSpaceUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const getStaffActivityLibraryErrorHandler = http.get(`*${getGetStaffActivityLibraryUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const deleteActivityDraftHandler = http.delete(`*${getDeleteActivityDraftUrl(':activityDraftId')}`, ({ params }) => {
  if (params.activityDraftId === 'INVALID_ACTIVITY_ID') {
    return HttpResponse.json(
      { code: EErrorCode.ACTIVITY_NOT_FOUND, message: 'Activity not found' },
      { status: HttpStatusCode.NOT_FOUND, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new HttpResponse(null, { status: HttpStatusCode.NO_CONTENT })
})

export const publishActivityDraftErrorHandler = http.post(`*${getPublishActivityDraftUrl(':activityDraftId')}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const publishActivityDraftHandler = http.post(`*${getPublishActivityDraftUrl(':activityDraftId')}`, ({ params }) => {
  if (params.activityDraftId === 'INVALID_ACTIVITY_DRAFT_ID') {
    return HttpResponse.json(
      { message: 'Activité non trouvée', code: ErrorCodes.ACTIVITY_NOT_FOUND },
      { status: HttpStatusCode.NOT_FOUND, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return HttpResponse.json<CreationResponse>({ createdItemId: mockedActivityDraftUpdateResponse.draftId }, {
    status: HttpStatusCode.CREATED,
    headers: { 'Content-Type': 'application/json' },
  })
})

export const staffsActivitiesHandlers = [
  http.get(`*${getGetActivityContentUrl(':status' as EActivityStatus, ':activityId')}`, () => {
    return HttpResponse.json<ActivityContentDTO>(mockedActivityContent, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
  http.get(`*${getGetActivityPresentationUrl(EActivityStatus.DRAFT, ':activityId')}`, ({ params }) => {
    const { activityId } = params

    if (activityId === 'INVALID_ACTIVITY_ID') {
      return HttpResponse.json(
        { code: EErrorCode.ACTIVITY_NOT_FOUND, message: 'Activity not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return HttpResponse.json<ActivityPresentationDTO>({ ...mockedActivityDetail, id: activityId as string }, {
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
  http.patch(`*${getUpdateActivityUrl(EActivityStatus.DRAFT, ':activityId')}`, ({ params }) => {
    const activityId: string | undefined = params.activityId as string | undefined

    if (!activityId) {
      return HttpResponse.json({ error: 'Activity ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (activityId === 'INVALID_ACTIVITY_ID') {
      return HttpResponse.json(
        { code: EErrorCode.ACTIVITY_NOT_FOUND, message: 'Activity not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

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
  deleteActivityDraftHandler,
  publishActivityDraftHandler,
  http.post(`*${getUploadFileUrl(EFileCategory.ACTIVITY_BANNER, ':activityId')}`, async ({ params, request }) => {
    const activityId: string | undefined = params.activityId as string | undefined

    if (!activityId) {
      return HttpResponse.json({ error: 'Activity ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return HttpResponse.json({ error: 'File is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (file.name === 'INVALID_FILE_NAME') {
      return HttpResponse.json(
        { code: EErrorCode.UNKNOWN_FILE_TYPE, message: 'Unknown file type' },
        { status: 415, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const response = createMockedBannerUploadResponse(activityId, file)
    return HttpResponse.json<FileDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
]

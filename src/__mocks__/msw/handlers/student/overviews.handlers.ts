import {
  createUpdatedCoverMock,
  createUpdatedPhotoMock,
  createUpdatedProfileMock,
  invalidProfile,
  mockedProfileOverview
} from '@/__mocks__/fixtures/student'
import { isEmptyDataSetRequest } from '@/__mocks__/msw/utils'
import {
  EFileCategory,
  EUserCategory,
  getGetProfileUrl,
  getUpdateProfileUrl,
  getUploadFileUrl,
  type ProfileOverviewDTO
} from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { http, HttpResponse, type PathParams } from 'msw'

export function createPutUpdateProfileHandler (payload: string) {
  return http.put(`*/me/users/:profile/update`, () => {
    return HttpResponse.json<string>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export function createPutUpdateProfileCoverHandler (payload: string) {
  return http.post(`*/me/storage/${EFileCategory.STAFF_COVER_PICTURE}/:elementId`, () => {
    return HttpResponse.json<string>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export function createPutUpdateProfilePhotoHandler (payload: string) {
  return http.post(`*${getUploadFileUrl(EFileCategory.STAFF_PROFILE_PICTURE, ':elementId')}`, () => {
    return HttpResponse.json<string>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export const putUpdateProfileErrorHandler = http.put(`*/me/users/:profile/update`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: 500 }
  )
})

// `/me/storage/users/${userCategory}/${photoType}`
export const putUpdateProfileCoverErrorHandler = http.post(`*${getUploadFileUrl(EFileCategory.STAFF_COVER_PICTURE, ':elementId')}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: 500 }
  )
})

export const putUpdateProfilePhotoErrorHandler = http.post(`*${getUploadFileUrl(EFileCategory.STAFF_PROFILE_PICTURE, ':elementId')}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: 500 }
  )
})

export const getProfileErrorHandler = http.get(`*${getGetProfileUrl(EUserCategory.STUDENT)}`, () => {
  return HttpResponse.json(
    { message: 'Student summary not found', code: ErrorCodes.NOT_FOUND },
    { status: 404 }
  )
})

export const overviewsHandlers = [
  http.get<PathParams, ProfileOverviewDTO>(`*${getGetProfileUrl(EUserCategory.STUDENT)}`, ({ request }) => {
    if (isEmptyDataSetRequest(request)) {
      return HttpResponse.json<ProfileOverviewDTO>({
        ...mockedProfileOverview,
        bio: ''
      }, {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return HttpResponse.json<ProfileOverviewDTO>(mockedProfileOverview, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.put(`*${getUpdateProfileUrl(':profile' as EUserCategory)}`, ({ params }) => {
    const profile: string | undefined = params.profile as string | undefined

    if (!profile) {
      return HttpResponse.json({ error: 'Profile is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (profile === invalidProfile) {
      return HttpResponse.json({ error: 'Profile not found', code: ErrorCodes.NOT_FOUND }, { status: 404 })
    }

    return HttpResponse.json<string>(createUpdatedProfileMock(profile), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.post(`*${getUploadFileUrl(':fileCatefory' as EFileCategory, ':elementId')}`, ({ params }) => {
    const profile: string | undefined = params.profile as string | undefined
    const fileCategory: string | undefined = params.fileCategory as string | undefined

    if (!profile) {
      return HttpResponse.json({ error: 'Profile is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (profile === invalidProfile) {
      return HttpResponse.json({ error: 'Profile not found', code: ErrorCodes.NOT_FOUND }, { status: 404 })
    }

    if (!fileCategory) {
      return HttpResponse.json({ error: 'fileCategory is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (fileCategory === EFileCategory.STAFF_COVER_PICTURE || fileCategory === EFileCategory.STUDENT_COVER_PICTURE) {
      return HttpResponse.json<string>(createUpdatedCoverMock(), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }

    if (fileCategory === EFileCategory.STAFF_PROFILE_PICTURE || fileCategory === EFileCategory.STUDENT_PROFILE_PICTURE) {
      return HttpResponse.json<string>(createUpdatedPhotoMock(), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }

    return HttpResponse.json({ error: 'fileCategory is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
  }),

]

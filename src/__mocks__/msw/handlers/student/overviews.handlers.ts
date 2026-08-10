import {
  createUpdatedCoverMock,
  createUpdatedPhotoMock,
  createUpdatedProfileMock,
  invalidProfile,
  mockedProfileOverview
} from '@/__mocks__/fixtures/student'
import { isEmptyDataSetRequest } from '@/__mocks__/msw/utils'
import {
  EUserCategory,
  getGetProfileUrl,
  getUpdateProfileUrl,
  getUploadCoverPictureUrl,
  getUploadProfilePictureUrl,
  type ProfileOverviewDTO
} from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { http, HttpResponse, type PathParams } from 'msw'

export function createPutUpdateProfileHandler (payload: string) {
  return http.put(`*${getUpdateProfileUrl(':profile' as EUserCategory)}`, () => {
    return HttpResponse.json<string>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export function createPutUpdateProfileCoverHandler (payload: string) {
  return http.post(`*${getUploadCoverPictureUrl(':userCategory' as EUserCategory)}`, () => {
    return HttpResponse.json<string>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export function createPutUpdateProfilePhotoHandler (payload: string) {
  return http.post(`*${getUploadProfilePictureUrl(':userCategory' as EUserCategory)}`, () => {
    return HttpResponse.json<string>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export const putUpdateProfileErrorHandler = http.put(`*${getUpdateProfileUrl(':profile' as EUserCategory)}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: 500 }
  )
})

export const putUpdateProfileCoverErrorHandler = http.post(`*${getUploadCoverPictureUrl(':userCategory' as EUserCategory)}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: 500 }
  )
})

export const putUpdateProfilePhotoErrorHandler = http.post(`*${getUploadProfilePictureUrl(':userCategory' as EUserCategory)}`, () => {
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

  http.post(`*${getUploadCoverPictureUrl(':userCategory' as EUserCategory)}`, ({ params }) => {
    const userCategory: string | undefined = params.userCategory as string | undefined

    if (!userCategory) {
      return HttpResponse.json({ error: 'userCategory is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (userCategory === invalidProfile) {
      return HttpResponse.json({ error: 'Profile not found', code: ErrorCodes.NOT_FOUND }, { status: 404 })
    }

    return HttpResponse.json<string>(createUpdatedCoverMock(), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.post(`*${getUploadProfilePictureUrl(':userCategory' as EUserCategory)}`, ({ params }) => {
    const userCategory: string | undefined = params.userCategory as string | undefined

    if (!userCategory) {
      return HttpResponse.json({ error: 'userCategory is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (userCategory === invalidProfile) {
      return HttpResponse.json({ error: 'Profile not found', code: ErrorCodes.NOT_FOUND }, { status: 404 })
    }

    return HttpResponse.json<string>(createUpdatedPhotoMock(), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

]

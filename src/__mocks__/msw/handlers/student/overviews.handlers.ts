import { createUpdatedCoverMock, createUpdatedPhotoMock, createUpdatedProfileMock, invalidProfile, mockedProfileOverview } from '@/__mocks__/fixtures/student'
import {
  EUserCategory,
  EUserPhotoType,
  getGetProfileUrl,
  type ProfileOverviewDTO
} from '@/api/avenir-esr'
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
  return http.put(`*/me/storage/users/:profile/${EUserPhotoType.COVER}`, () => {
    return HttpResponse.json<string>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export function createPutUpdateProfilePhotoHandler (payload: string) {
  return http.put(`*/me/storage/users/:profile/${EUserPhotoType.PROFILE}`, () => {
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
    { message: 'Internal server error' },
    { status: 500 }
  )
})

// `/me/storage/users/${userCategory}/${photoType}`
export const putUpdateProfileCoverErrorHandler = http.put(`*/me/storage/users/:profile/${EUserPhotoType.COVER}`, () => {
  return HttpResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
  )
})

export const putUpdateProfilePhotoErrorHandler = http.put(`*/me/storage/users/:profile/${EUserPhotoType.PROFILE}`, () => {
  return HttpResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
  )
})

export const getProfileErrorHandler = http.get(`*${getGetProfileUrl(EUserCategory.STUDENT)}`, () => {
  return HttpResponse.json(
    { message: 'Student summary not found' },
    { status: 404 }
  )
})

export const overviewsHandlers = [
  http.get<PathParams, ProfileOverviewDTO>(`*${getGetProfileUrl(EUserCategory.STUDENT)}`, () => {
    return HttpResponse.json<ProfileOverviewDTO>(mockedProfileOverview, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.put(`*/me/user/:profile/update`, ({ params }) => {
    const profile: string | undefined = params.profile as string | undefined

    if (!profile) {
      return HttpResponse.json({ error: 'Profile is required' }, { status: 400 })
    }

    if (profile === invalidProfile) {
      return HttpResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return HttpResponse.json<string>(createUpdatedProfileMock(profile), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.put(`*/me/user/:profile/update/cover`, ({ params }) => {
    const profile: string | undefined = params.profile as string | undefined

    if (!profile) {
      return HttpResponse.json({ error: 'Profile is required' }, { status: 400 })
    }

    if (profile === invalidProfile) {
      return HttpResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return HttpResponse.json<string>(createUpdatedCoverMock(), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.put(`*/me/user/:profile/update/photo`, ({ params }) => {
    const profile: string | undefined = params.profile as string | undefined

    if (!profile) {
      return HttpResponse.json({ error: 'Profile is required' }, { status: 400 })
    }

    if (profile === invalidProfile) {
      return HttpResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return HttpResponse.json<string>(createUpdatedPhotoMock(), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),
]

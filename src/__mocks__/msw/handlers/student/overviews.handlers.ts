import { createUpdatedCoverMock, createUpdatedPhotoMock, createUpdatedProfileMock, invalidProfile, mockedProfileOverview } from '@/__mocks__/fixtures/student'
import {
  getGetProfileUrl,
  type ProfileOverviewDTO
} from '@/api/avenir-esr'
import { http, HttpResponse, type PathParams } from 'msw'

const PROFILE = 'student'
export const overviewsHandlers = [
  http.get<PathParams, ProfileOverviewDTO>(`*${getGetProfileUrl(PROFILE)}`, () => {
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

import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
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
]

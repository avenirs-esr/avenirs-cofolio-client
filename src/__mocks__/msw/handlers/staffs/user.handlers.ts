import { mockedStaffProfileOverview } from '@/__mocks__/fixtures/staffs/user.fixtures'
import {
  EUserCategory,
  getGetProfileUrl,
  type ProfileOverviewDTO
} from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { http, HttpResponse, type PathParams } from 'msw'

export const getStaffProfileErrorHandler = http.get(`*${getGetProfileUrl(EUserCategory.STAFF)}`, () => {
  return HttpResponse.json(
    { message: 'Staff summary not found', code: ErrorCodes.NOT_FOUND },
    { status: 404 }
  )
})

export const staffsUserHandlers = [
  http.get<PathParams, ProfileOverviewDTO>(`*${getGetProfileUrl(EUserCategory.STAFF)}`, () => {
    return HttpResponse.json<ProfileOverviewDTO>(mockedStaffProfileOverview, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),
]

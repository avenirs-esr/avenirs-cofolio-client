import { mockedStaffProfileOverview, mockedStaffQuickLinks } from '@/__mocks__/fixtures/staffs/user.fixtures'
import { quickLinksState } from '@/__mocks__/msw/common/quickLinks.state'
import {
  EUserCategory,
  getGetProfileUrl,
  getGetQuickLinksUrl,
  type ProfileOverviewDTO,
  type QuickLinksDTO
} from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'
import { http, HttpResponse, type PathParams } from 'msw'

export const getStaffProfileErrorHandler = http.get(`*${getGetProfileUrl(EUserCategory.STAFF)}`, () => {
  return HttpResponse.json(
    { message: 'Staff summary not found', code: ErrorCodes.NOT_FOUND },
    { status: 404 }
  )
})

export const getStaffQuickLinksErrorHandler = http.get(`*${getGetQuickLinksUrl(EUserCategory.STAFF)}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const staffUserHandlers = [
  http.get<PathParams, ProfileOverviewDTO>(`*${getGetProfileUrl(EUserCategory.STAFF)}`, () => {
    return HttpResponse.json<ProfileOverviewDTO>(mockedStaffProfileOverview, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' }
    })
  }),

  http.get<PathParams, QuickLinksDTO>(`*${getGetQuickLinksUrl(EUserCategory.STAFF)}`, () => {
    return HttpResponse.json<QuickLinksDTO>(quickLinksState.STAFF, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' }
    })
  }),
]

export const getStaffQuickLinksEnabledHandler = http.get<PathParams, QuickLinksDTO>(
  `*${getGetQuickLinksUrl(EUserCategory.STAFF)}`,
  () => {
    return HttpResponse.json<QuickLinksDTO>(
      { ...mockedStaffQuickLinks, notificationEnabled: true },
      {
        status: HttpStatusCode.OK,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  },
)

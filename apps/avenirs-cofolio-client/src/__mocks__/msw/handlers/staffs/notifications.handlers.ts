import type { PagedResponseNotificationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PathParams } from 'msw'
import { ErrorCodes, HttpStatusCode } from '@avenirs-esr/shared'
import { EUserCategory, getGetNotificationsUrl } from '@avenirs-esr/shared/api/avenir-esr'
import { http, HttpResponse } from 'msw'
import { createStaffMockedPagedResponseNotifications } from '@/__mocks__/fixtures/staffs/notifications.fixtures'

export const getStaffNotificationsErrorHandler = http.get(`*${getGetNotificationsUrl(EUserCategory.STAFF)}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const staffNotificationsHandlers = [
  http.get<PathParams, PagedResponseNotificationDTO>(`*${getGetNotificationsUrl(EUserCategory.STAFF)}`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '10')
    const mockedNotifications = createStaffMockedPagedResponseNotifications(pageSize, 20, page)

    return HttpResponse.json<PagedResponseNotificationDTO>(mockedNotifications, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
]

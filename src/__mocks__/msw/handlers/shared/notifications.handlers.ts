import { quickLinksState } from '@/__mocks__/msw/common/quickLinks.state'
import { EUserCategory, getUpdateNotificationPreferencesUrl, type NotificationPreferencesRequest } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'
import { http, HttpResponse, type PathParams } from 'msw'

export const notificationsHandlers = [
  http.patch<PathParams, NotificationPreferencesRequest>(`*${getUpdateNotificationPreferencesUrl()}`, async ({ request }) => {
    const body = await request.json()

    if (body.notificationEnabled === undefined) {
      return HttpResponse.json(
        { message: 'Internal Server Error', code: ErrorCodes.SERVER },
        { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
      )
    }

    quickLinksState[EUserCategory.STAFF].notificationEnabled = body.notificationEnabled
    quickLinksState[EUserCategory.STUDENT].notificationEnabled = body.notificationEnabled

    return HttpResponse.json<string>('', {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
]

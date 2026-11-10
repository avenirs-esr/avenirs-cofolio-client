import type { NotificationPreferencesRequest } from '@avenirs-esr/shared/api/avenir-esr'
import type { PathParams } from 'msw'
import { ErrorCodes, HttpStatusCode } from '@avenirs-esr/shared'
import { EUserCategory, getUpdateNotificationPreferencesUrl } from '@avenirs-esr/shared/api/avenir-esr'
import { http, HttpResponse } from 'msw'
import { quickLinksState } from '@/__mocks__/msw/common/quickLinks.state'

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

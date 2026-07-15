import { createStudentMockedPagedResponseNotifications } from '@/__mocks__/fixtures/student/notifications.fixtures'
import { EUserCategory, getGetNotificationsUrl, getMarkAsSeenUrl, type PagedResponseNotificationDTO } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'
import { http, HttpResponse, type PathParams } from 'msw'

export const getStudentNotificationsErrorHandler = http.get(`*${getGetNotificationsUrl(EUserCategory.STUDENT)}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const markStudentNotificationAsSeenErrorHandler = http.patch(
  `*${getMarkAsSeenUrl(':id')}`,
  () => {
    return HttpResponse.json(
      {
        message: 'Internal Server Error',
        code: ErrorCodes.SERVER,
      },
      {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  },
)

export const studentNotificationsHandlers = [
  http.get<PathParams, PagedResponseNotificationDTO>(`*${getGetNotificationsUrl(EUserCategory.STUDENT)}`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '10')
    const mockedNotifications = createStudentMockedPagedResponseNotifications(pageSize, 20, page)

    return HttpResponse.json<PagedResponseNotificationDTO>(mockedNotifications, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
  http.patch<{ id: string }>(
    `*${getMarkAsSeenUrl(':id')}`,
    ({ params }) => {
      const { id } = params

      if (!id) {
        return HttpResponse.json(
          {
            message: 'Notification id is required',
            code: ErrorCodes.SERVER,
          },
          {
            status: HttpStatusCode.BAD_REQUEST,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      return new HttpResponse(null, {
        status: HttpStatusCode.NO_CONTENT,
      })
    },
  ),
]

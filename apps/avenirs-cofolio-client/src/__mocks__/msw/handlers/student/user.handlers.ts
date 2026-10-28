import type { PathParams } from 'msw'
import type { QuickLinksDTO } from '@/api/avenir-esr'
import { ErrorCodes, HttpStatusCode } from '@avenirs-esr/shared'
import { http, HttpResponse } from 'msw'
import { mockedStudentQuickLinks } from '@/__mocks__/fixtures/student/user.fixtures'
import { quickLinksState } from '@/__mocks__/msw/common/quickLinks.state'
import {
  EUserCategory,
  getGetQuickLinksUrl

} from '@/api/avenir-esr'

export const getStudentQuickLinksErrorHandler = http.get(`*${getGetQuickLinksUrl(EUserCategory.STUDENT)}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const getStudentQuickLinksDisabledHandler = http.get<PathParams, QuickLinksDTO>(
  `*${getGetQuickLinksUrl(EUserCategory.STUDENT)}`,
  () => {
    return HttpResponse.json<QuickLinksDTO>(
      { ...mockedStudentQuickLinks, notificationEnabled: false },
      {
        status: HttpStatusCode.OK,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  },
)

export const studentUserHandlers = [
  http.get<PathParams, QuickLinksDTO>(`*${getGetQuickLinksUrl(EUserCategory.STUDENT)}`, () => {
    return HttpResponse.json<QuickLinksDTO>(quickLinksState.STUDENT, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' }
    })
  }),
]

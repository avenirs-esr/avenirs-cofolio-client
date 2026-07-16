import { mockedStudentQuickLinks } from '@/__mocks__/fixtures/student/user.fixtures'
import { quickLinksState } from '@/__mocks__/msw/common/quickLinks.state'
import {
  EUserCategory,
  getGetQuickLinksUrl,
  type QuickLinksDTO
} from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'
import { http, HttpResponse, type PathParams } from 'msw'

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

import type { AlertMessageDTO, BuildLifeProjectConfigDTO } from '@/api/avenir-esr'
import { HttpStatusCode } from '@avenirs-esr/shared'
import { http, HttpResponse } from 'msw'
import { mockedAlertMessageResponse, mockedBuildLifeProjectConfigResponse } from '@/__mocks__/fixtures/student/back-office.fixtures'
import { getGetAlertMessageUrl, getGetBuildLifeProjectConfigUrl } from '@/api/avenir-esr'

export function createAlertMessageHandler (response: AlertMessageDTO = mockedAlertMessageResponse, onRequest?: () => void) {
  return http.get(`*${getGetAlertMessageUrl()}`, () => {
    onRequest?.()

    return HttpResponse.json<AlertMessageDTO>(response, {
      status: HttpStatusCode.OK,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })
}

export const alertMessageUnauthorizedHandler = http.get(`*${getGetAlertMessageUrl()}`, () => {
  return new HttpResponse(null, { status: HttpStatusCode.UNAUTHORIZED })
})

export const backOfficeHandlers = [
  http.get(`*${getGetBuildLifeProjectConfigUrl()}`, () => {
    return HttpResponse.json<BuildLifeProjectConfigDTO>(mockedBuildLifeProjectConfigResponse, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),
  createAlertMessageHandler()
]

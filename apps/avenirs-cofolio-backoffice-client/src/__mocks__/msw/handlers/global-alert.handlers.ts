import type { HttpHandler } from 'msw'
import type { AlertConfigurationDTO } from '@/api/avenir-esr'
import { internalServerError, successJsonResponse } from '@avenirs-esr/shared/test-utils/msw'
import { http } from 'msw'
import { mockedAlertConfigurationDTO } from '@/__mocks__/fixtures/global-alert.fixtures'
import { getGetAlertConfigUrl, getPutAlertConfigUrl } from '@/api/avenir-esr'

export const getAlertConfigErrorHandler = http.get(`*${getGetAlertConfigUrl()}`, internalServerError)

export function createPutAlertConfigHandler (onRequest?: (alert: AlertConfigurationDTO) => void): HttpHandler {
  return http.put(`*${getPutAlertConfigUrl()}`, async ({ request }) => {
    const alert = await request.json() as AlertConfigurationDTO
    onRequest?.(alert)
    return successJsonResponse(alert)
  })
}

export const putAlertErrorHandler = http.put(`*${getPutAlertConfigUrl()}`, internalServerError)

export const globalAlertHandlers = [
  http.get(`*${getGetAlertConfigUrl()}`, () => successJsonResponse(mockedAlertConfigurationDTO)),
  createPutAlertConfigHandler(),
]

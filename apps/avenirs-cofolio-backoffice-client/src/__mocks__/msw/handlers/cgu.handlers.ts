import type { HttpHandler } from 'msw'
import { getGetLatestCguUrl, getUploadCguUrl } from '@avenirs-esr/shared/api/avenir-esr'
import { internalServerError, successJsonResponse } from '@avenirs-esr/shared/test-utils/msw'
import { http } from 'msw'
import { mockedCguDTO } from '@/__mocks__/fixtures/cgu.fixtures'

export const getLatestCguErrorHandler = http.get(`*${getGetLatestCguUrl()}`, internalServerError)

export function createUploadCguHandler (onRequest?: () => void): HttpHandler {
  return http.post(`*${getUploadCguUrl()}`, () => {
    onRequest?.()
    return successJsonResponse({ id: 'file-id' })
  })
}

export const uploadCguErrorHandler = http.post(`*${getUploadCguUrl()}`, internalServerError)

export const cguHandlers = [
  http.get(`*${getGetLatestCguUrl()}`, () => successJsonResponse(mockedCguDTO)),
  createUploadCguHandler(),
]

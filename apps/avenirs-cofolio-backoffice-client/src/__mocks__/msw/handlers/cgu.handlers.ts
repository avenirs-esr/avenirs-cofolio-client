import type { HttpHandler } from 'msw'
import { internalServerError, successJsonResponse } from '@avenirs-esr/shared/test-utils/msw'
import { http } from 'msw'
import { mockedCguDTO } from '@/__mocks__/fixtures/cgu.fixtures'
import { getGetLatestCguUrl, getUploadCguUrl } from '@/api/avenir-esr'

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

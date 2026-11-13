import type { AcceptedCguDTO, CguDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { ErrorCodes, HttpStatusCode } from '@avenirs-esr/shared'
import { getAcceptCguUrl, getGetLatestCguUrl } from '@avenirs-esr/shared/api/avenir-esr'
import { delay, http, HttpResponse } from 'msw'
import { mockedAcceptedCgu, mockedCgu } from '@/__mocks__/fixtures/shared/cgu.fixtures'

export function createCguQueryHandler (onRequest?: (request: Request) => void) {
  return http.get(`*${getGetLatestCguUrl()}`, ({ request }) => {
    onRequest?.(request)

    return HttpResponse.json<CguDTO>(mockedCgu, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' }
    })
  })
}

export const cguQueryErrorHandler = http.get(`*${getGetLatestCguUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      headers: { 'Content-Type': 'application/json' }
    }
  )
})

export const cguQueryLoadingHandler = http.get(`*${getGetLatestCguUrl()}`, async () => {
  await delay('infinite')
  return HttpResponse.json<CguDTO>(mockedCgu, { status: HttpStatusCode.OK })
})

export const acceptCguErrorHandler = http.post(`*${getAcceptCguUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      headers: { 'Content-Type': 'application/json' }
    }
  )
})

export const cguHandlers = [
  createCguQueryHandler(),
  http.post(`*${getAcceptCguUrl()}`, () => {
    return HttpResponse.json<AcceptedCguDTO>(mockedAcceptedCgu, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' }
    })
  })
]

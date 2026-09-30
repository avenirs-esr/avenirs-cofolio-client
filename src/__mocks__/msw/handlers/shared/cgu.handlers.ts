import { mockedAcceptedCgu, mockedCgu } from '@/__mocks__/fixtures/shared/cgu.fixtures'
import { type AcceptedCguDTO, type CguDTO, getAcceptCguUrl, getGetLatestCguUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'
import { delay, http, HttpResponse } from 'msw'

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
  http.get(`*${getGetLatestCguUrl()}`, () => {
    return HttpResponse.json<CguDTO>(mockedCgu, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' }
    })
  }),
  http.post(`*${getAcceptCguUrl()}`, () => {
    return HttpResponse.json<AcceptedCguDTO>(mockedAcceptedCgu, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' }
    })
  })
]

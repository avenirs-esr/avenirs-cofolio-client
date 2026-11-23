import { getGetNationalToolsUrl } from '@avenirs-esr/shared/api/avenir-esr'
import { internalServerError, successJsonResponse } from '@avenirs-esr/shared/test-utils/msw'
import { http } from 'msw'
import { createMockedGetNationalToolsResponse } from '@/__mocks__/fixtures/shared/national-tools.fixtures'

export const getNationalToolsErrorHandler = http.get(`*${getGetNationalToolsUrl()}`, async () => {
  return internalServerError()
})

const getNationalToolsHandler = http.get(`*${getGetNationalToolsUrl()}`, async ({ request }) => {
  const searchParams = new URL(request.url).searchParams
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : undefined
  const pageSize = searchParams.has('pageSize') ? Number(searchParams.get('pageSize')) : undefined

  const response = createMockedGetNationalToolsResponse({ page, pageSize }, 30)

  return successJsonResponse(response)
})

export const nationalToolsHandlers = [
  getNationalToolsHandler
]

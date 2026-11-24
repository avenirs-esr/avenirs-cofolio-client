import type { EToolType } from '@avenirs-esr/shared/api/avenir-esr'
import { getGetLocalToolsUrl } from '@avenirs-esr/shared/api/avenir-esr'
import { internalServerError, successJsonResponse } from '@avenirs-esr/shared/test-utils/msw'
import { http } from 'msw'
import { createMockedGetLocalToolsResponse } from '@/__mocks__/fixtures/staffs/tools.fixtures'

export const getLocalToolsErrorHandler = http.get(`*${getGetLocalToolsUrl()}`, async () => {
  return internalServerError()
})

const getLocalToolsHandler = http.get(`*${getGetLocalToolsUrl()}`, async ({ request }) => {
  const searchParams = new URL(request.url).searchParams
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : undefined
  const pageSize = searchParams.has('pageSize') ? Number(searchParams.get('pageSize')) : undefined
  const type = searchParams.has('type') ? searchParams.get('type') as EToolType : undefined

  const response = createMockedGetLocalToolsResponse({ page, pageSize, type }, 30)

  return successJsonResponse(response)
})

export const localToolsHandlers = [
  getLocalToolsHandler
]

import type { EToolType } from '#shared/api/avenir-esr'
import {
  createMockedGetAvailableToolsResponse,
  createMockedGetLocalToolsResponse,
  createMockedGetNationalToolsResponse
} from '#shared/__mocks__/fixtures/tools.fixtures'
import { getGetAvailableToolsUrl, getGetLocalToolsUrl, getGetNationalToolsUrl } from '#shared/api/avenir-esr'
import { internalServerError, successJsonResponse } from '@avenirs-esr/shared/test-utils/msw'
import { http } from 'msw'

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

export const getAvailableToolsErrorHandler = http.get(`*${getGetAvailableToolsUrl()}`, async () => {
  return internalServerError()
})

const getAvailableToolsHandler = http.get(`*${getGetAvailableToolsUrl()}`, async ({ request }) => {
  const searchParams = new URL(request.url).searchParams
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : undefined
  const pageSize = searchParams.has('pageSize') ? Number(searchParams.get('pageSize')) : undefined
  const type = searchParams.has('type') ? searchParams.get('type') as EToolType : undefined

  const response = createMockedGetAvailableToolsResponse({ page, pageSize, type }, 30)

  return successJsonResponse(response)
})

export const toolsHandlers = [
  getNationalToolsHandler,
  getLocalToolsHandler,
  getAvailableToolsHandler
]

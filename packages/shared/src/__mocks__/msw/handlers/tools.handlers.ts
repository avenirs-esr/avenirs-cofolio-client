import type { CreateLocalToolRequest, CreateNationalToolRequest } from '#shared/api/avenir-esr'
import {
  createMockedCreatedLocalToolDTO,
  createMockedCreatedNationalToolDTO,
  createMockedGetAvailableToolsResponse,
  createMockedGetLocalToolsResponse,
  createMockedGetNationalToolsResponse,
  createMockedToolBannerFileDTO,
  getToolDTO
} from '#shared/__mocks__/fixtures/tools.fixtures'
import {
  EToolType,
  getCreateLocalToolUrl,
  getCreateNationalToolUrl,
  getGetAvailableToolsUrl,
  getGetLocalToolsUrl,
  getGetLocalToolUrl,
  getGetNationalToolsUrl,
  getGetNationalToolUrl,
  getUploadLocalToolBannerUrl,
  getUploadNationalToolBannerUrl
} from '#shared/api/avenir-esr'
import { internalServerError, successJsonResponse } from '@avenirs-esr/shared/test-utils/msw'
import { http } from 'msw'

export const INTERNAL_ERROR_TOOL_ID = 'INTERNAL_ERROR_ID'

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

const getNationalToolHandler = http.get(`*${getGetNationalToolUrl(':toolId')}`, async ({ params }) => {
  const id = params.toolId

  if (id === 'INVALID_ID') {
    return internalServerError()
  }

  return successJsonResponse(getToolDTO(0, EToolType.NATIONAL))
})

const getLocalToolHandler = http.get(`*${getGetLocalToolUrl(':toolId')}`, async ({ params }) => {
  const id = params.toolId

  if (!id || id === 'INVALID_ID') {
    return internalServerError()
  }

  if (String(id).startsWith(EToolType.LOCAL.toLowerCase())) {
    return successJsonResponse(getToolDTO(0, EToolType.LOCAL))
  }

  if (String(id).startsWith(EToolType.REGIONAL.toLowerCase())) {
    return successJsonResponse(getToolDTO(0, EToolType.REGIONAL))
  }

  return successJsonResponse(getToolDTO(0, EToolType.LOCAL))
})

export const createNationalToolErrorHandler = http.post(`*${getCreateNationalToolUrl()}`, async () => {
  return internalServerError()
})

const createNationalToolHandler = http.post(`*${getCreateNationalToolUrl()}`, async ({ request }) => {
  const body = await request.json() as CreateNationalToolRequest

  return successJsonResponse(createMockedCreatedNationalToolDTO(body))
})

const createLocalToolHandler = http.post(`*${getCreateLocalToolUrl()}`, async ({ request }) => {
  const body = await request.json() as CreateLocalToolRequest

  return successJsonResponse(createMockedCreatedLocalToolDTO(body))
})

const uploadNationalToolBannerHandler = http.post(`*${getUploadNationalToolBannerUrl(':toolId')}`, async ({ params }) => {
  const toolId = String(params.toolId)

  if (toolId === INTERNAL_ERROR_TOOL_ID) {
    return internalServerError()
  }

  return successJsonResponse(createMockedToolBannerFileDTO(toolId))
})

const uploadLocalToolBannerHandler = http.post(`*${getUploadLocalToolBannerUrl(':toolId')}`, async ({ params }) => {
  const toolId = String(params.toolId)

  if (toolId === INTERNAL_ERROR_TOOL_ID) {
    return internalServerError()
  }

  return successJsonResponse(createMockedToolBannerFileDTO(toolId))
})

export const toolsHandlers = [
  getNationalToolsHandler,
  getLocalToolsHandler,
  getAvailableToolsHandler,
  getNationalToolHandler,
  getLocalToolHandler,
  createNationalToolHandler,
  createLocalToolHandler,
  uploadNationalToolBannerHandler,
  uploadLocalToolBannerHandler,
]

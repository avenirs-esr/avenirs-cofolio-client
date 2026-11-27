import type { CreateLocalToolRequest, CreateNationalToolRequest, ToolDTO } from '#shared/api/avenir-esr'
import {
  createMockedCreatedLocalToolDTO,
  createMockedCreatedNationalToolDTO,
  createMockedGetAvailableToolsResponse,
  createMockedGetLocalToolsResponse,
  createMockedGetNationalToolsResponse,
  createMockedToolBannerFileDTO,
  getToolDTO,
  INVALID_TOOL_ID,
  MOCKED_TOOLS_TOTAL_ELEMENTS
} from '#shared/__mocks__/fixtures/tools.fixtures'
import {
  EToolType,
  getCreateLocalToolUrl,
  getCreateNationalToolUrl,
  getDeleteLocalToolsUrl,
  getDeleteNationalToolsUrl,
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

  const response = createMockedGetNationalToolsResponse({ page, pageSize }, MOCKED_TOOLS_TOTAL_ELEMENTS)

  return successJsonResponse(response)
})

export const getNationalToolsWithInvalidIdHandler = http.get(`*${getGetNationalToolsUrl()}`, async ({ request }) => {
  const searchParams = new URL(request.url).searchParams
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : undefined
  const pageSize = searchParams.has('pageSize') ? Number(searchParams.get('pageSize')) : undefined
  const response = createMockedGetNationalToolsResponse({ page, pageSize }, MOCKED_TOOLS_TOTAL_ELEMENTS)

  if (response.data[0]) {
    response.data[0].id = `national-${INVALID_TOOL_ID}`
  }

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

  const response = createMockedGetLocalToolsResponse({ page, pageSize, type }, MOCKED_TOOLS_TOTAL_ELEMENTS)

  return successJsonResponse(response)
})

export const getLocalToolsWithInvalidIdHandler = http.get(`*${getGetLocalToolsUrl()}`, async ({ request }) => {
  const searchParams = new URL(request.url).searchParams
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : undefined
  const pageSize = searchParams.has('pageSize') ? Number(searchParams.get('pageSize')) : undefined
  const type = searchParams.has('type') ? searchParams.get('type') as EToolType : undefined
  const response = createMockedGetLocalToolsResponse({ page, pageSize, type }, MOCKED_TOOLS_TOTAL_ELEMENTS)

  if (response.data[0]) {
    response.data[0].id = `local-${INVALID_TOOL_ID}`
  }

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

  const response = createMockedGetAvailableToolsResponse({ page, pageSize, type }, MOCKED_TOOLS_TOTAL_ELEMENTS)

  return successJsonResponse(response)
})

const getNationalToolHandler = http.get(`*${getGetNationalToolUrl(':toolId')}`, async ({ params }) => {
  const id = String(params.toolId)

  if (id === 'INVALID_ID') {
    return internalServerError()
  }

  const response: ToolDTO = { ...getToolDTO(0, EToolType.NATIONAL), id }
  return successJsonResponse(response)
})

const getLocalToolHandler = http.get(`*${getGetLocalToolUrl(':toolId')}`, async ({ params }) => {
  const id = String(params.toolId)

  if (!id || id === 'INVALID_ID') {
    return internalServerError()
  }

  if (id.startsWith(EToolType.LOCAL.toLowerCase())) {
    const response: ToolDTO = { ...getToolDTO(0, EToolType.LOCAL), id }
    return successJsonResponse(response)
  }

  if (id.startsWith(EToolType.REGIONAL.toLowerCase())) {
    const response: ToolDTO = { ...getToolDTO(0, EToolType.REGIONAL), id }
    return successJsonResponse(response)
  }

  return successJsonResponse(getToolDTO(0, EToolType.LOCAL))
})

export const createNationalToolErrorHandler = http.post(`*${getCreateNationalToolUrl()}`, async () => {
  return internalServerError()
})

const deleteNationalToolsHandler = http.delete(`*${getDeleteNationalToolsUrl()}`, async ({ request }) => {
  const toolIds = await request.json() as string[]

  if (toolIds.some(id => id.includes(INVALID_TOOL_ID))) {
    return internalServerError()
  }

  return successJsonResponse(null)
})

const deleteLocalToolsHandler = http.delete(`*${getDeleteLocalToolsUrl()}`, async ({ request }) => {
  const toolIds = await request.json() as string[]

  if (toolIds.some(id => id.includes(INVALID_TOOL_ID))) {
    return internalServerError()
  }

  return successJsonResponse(null)
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
  deleteNationalToolsHandler,
  deleteLocalToolsHandler,
  uploadNationalToolBannerHandler,
  uploadLocalToolBannerHandler,
]

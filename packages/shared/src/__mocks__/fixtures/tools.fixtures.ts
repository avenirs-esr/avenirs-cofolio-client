import type {
  CreateLocalToolRequest,
  CreateNationalToolRequest,
  FileDTO,
  GetLocalToolsParams,
  GetNationalToolsParams,
  PagedResponseToolDTO,
  ToolDTO
} from '#shared/api/avenir-esr'
import { EFileType, EToolType } from '#shared/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'

export function getToolDTO (index: number, forcedType?: EToolType): ToolDTO {
  let type = EToolType.LOCAL

  if (!forcedType && index % 2 === 0) {
    type = EToolType.REGIONAL
  }

  if (forcedType) {
    type = forcedType
  }

  return {
    id: `${type.toLowerCase()}-tool-${index}`,
    name: `Outil ${type.toLowerCase()} ${index}`,
    description: `Description pour l'outil ${type.toLowerCase()} ${index}`,
    url: `https://example.com/${type.toLowerCase()}-tool-${index}`,
    type,
  }
}

export function generateToolDTOs (count: number, forcedType?: EToolType): ToolDTO[] {
  return Array.from({ length: count }, (_, index) => getToolDTO(index, forcedType))
}

export function createMockedGetNationalToolsResponse (
  getNationalToolsParams: GetNationalToolsParams,
  totalElements: number
): PagedResponseToolDTO {
  const { page = 0, pageSize = PageSizes.TWELVE } = getNationalToolsParams

  const mockedNationalTools = generateToolDTOs(totalElements, EToolType.NATIONAL)

  const start = page * pageSize
  const end = start + pageSize
  const paginatedNationalTools = mockedNationalTools.slice(start, end)
  const totalPages = Math.ceil(mockedNationalTools.length / pageSize)

  return {
    data: paginatedNationalTools,
    page: { pageSize, totalElements: mockedNationalTools.length, totalPages, page }
  }
}

export function createMockedGetLocalToolsResponse (
  getLocalToolsParams: GetLocalToolsParams,
  totalElements: number
): PagedResponseToolDTO {
  const { page = 0, pageSize = PageSizes.TWELVE } = getLocalToolsParams

  const mockedLocalTools = generateToolDTOs(totalElements)

  let filteredLocalTools = mockedLocalTools

  if (getLocalToolsParams.type) {
    filteredLocalTools = filteredLocalTools.filter(tool => tool.type === getLocalToolsParams.type)
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedLocalTools = filteredLocalTools.slice(start, end)
  const totalPages = Math.ceil(filteredLocalTools.length / pageSize)

  return {
    data: paginatedLocalTools,
    page: { pageSize, totalElements: filteredLocalTools.length, totalPages, page }
  }
}

export function createMockedGetAvailableToolsResponse (
  getAvailableToolsParams: GetLocalToolsParams,
  totalElements: number
): PagedResponseToolDTO {
  const { page = 0, pageSize = PageSizes.TWELVE } = getAvailableToolsParams

  const mockedAvailableTools = generateToolDTOs(totalElements)

  let filteredAvailableTools = mockedAvailableTools

  if (getAvailableToolsParams.type) {
    filteredAvailableTools = filteredAvailableTools.filter(tool => tool.type === getAvailableToolsParams.type)
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedAvailableTools = filteredAvailableTools.slice(start, end)
  const totalPages = Math.ceil(filteredAvailableTools.length / pageSize)

  return {
    data: paginatedAvailableTools,
    page: { pageSize, totalElements: filteredAvailableTools.length, totalPages, page }
  }
}

export const CREATED_TOOL_ID = 'created-tool-id'

export function createMockedCreatedNationalToolDTO (request: CreateNationalToolRequest, overrides: Partial<ToolDTO> = {}): ToolDTO {
  return {
    id: CREATED_TOOL_ID,
    name: request.name,
    description: request.description,
    url: request.url,
    type: EToolType.NATIONAL,
    ...overrides,
  }
}

export function createMockedCreatedLocalToolDTO (request: CreateLocalToolRequest, overrides: Partial<ToolDTO> = {}): ToolDTO {
  return {
    id: CREATED_TOOL_ID,
    name: request.name,
    description: request.description,
    url: request.url,
    type: EToolType.LOCAL,
    ...(request.institutionId && { institution: { id: request.institutionId, name: 'Établissement' } }),
    ...overrides,
  }
}

export function createMockedToolBannerFileDTO (toolId: string, fileName = 'banner.png'): FileDTO {
  return {
    id: `${toolId}-banner`,
    fileName,
    fileType: EFileType.PNG,
    fileSize: 1024,
    url: `https://example.com/${toolId}/${fileName}`,
    uploadedAt: '2026-11-23T10:00:00Z',
  }
}

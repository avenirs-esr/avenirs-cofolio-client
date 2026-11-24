import type { GetLocalToolsParams, GetNationalToolsParams, PagedResponseToolDTO, ToolDTO } from '#shared/api/avenir-esr'
import { EToolType } from '#shared/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'

function getToolDTO (index: number, forcedType?: EToolType): ToolDTO {
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

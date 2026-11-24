import type { GetLocalToolsParams, PagedResponseToolDTO, ToolDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { EToolType } from '@avenirs-esr/shared/api/avenir-esr'

function getToolDTO (index: number): ToolDTO {
  let type = EToolType.LOCAL

  if (index % 2 === 0) {
    type = EToolType.REGIONAL
  }

  return {
    id: `${type.toLowerCase()}-tool-${index}`,
    name: `Outil ${type.toLowerCase()} ${index}`,
    description: `Description pour l'outil ${type.toLowerCase()} ${index}`,
    url: `https://example.com/tool-${index}`,
    type,
  }
}

export function generateLocalToolDTOs (count: number): ToolDTO[] {
  return Array.from({ length: count }, (_, index) => getToolDTO(index))
}

export function createMockedGetLocalToolsResponse (
  getLocalToolsParams: GetLocalToolsParams,
  totalElements: number
): PagedResponseToolDTO {
  const { page = 0, pageSize = PageSizes.TWELVE } = getLocalToolsParams

  const mockedLocalTools = generateLocalToolDTOs(totalElements)

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

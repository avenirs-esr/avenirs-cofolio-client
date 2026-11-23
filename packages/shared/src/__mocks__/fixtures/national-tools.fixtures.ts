import type { GetNationalToolsParams, PagedResponseToolDTO, ToolDTO } from '#shared/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'

function getNationalToolDTO (index: number): ToolDTO {
  return {
    id: `national-tool-${index}`,
    name: `Outil national ${index}`,
    description: `Description pour l'outil national ${index}`,
    url: `https://example.com/tool-${index}`,
  }
}

export function generateToolDTOs (count: number): ToolDTO[] {
  return Array.from({ length: count }, (_, index) => getNationalToolDTO(index))
}

export function createMockedGetNationalToolsResponse (
  getNationalToolsParams: GetNationalToolsParams,
  totalElements: number
): PagedResponseToolDTO {
  const { page = 0, pageSize = PageSizes.FOUR } = getNationalToolsParams

  const mockedNationalTools = generateToolDTOs(totalElements)

  const start = page * pageSize
  const end = start + pageSize
  const paginatedNationalTools = mockedNationalTools.slice(start, end)
  const totalPages = Math.ceil(mockedNationalTools.length / pageSize)

  return {
    data: paginatedNationalTools,
    page: { pageSize, totalElements: mockedNationalTools.length, totalPages, page }
  }
}

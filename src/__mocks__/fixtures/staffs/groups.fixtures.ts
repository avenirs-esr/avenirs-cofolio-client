import type { GetGroupsParams, GroupDTO, GroupOverviewDTO, PagedResponseGroupOverviewDTO } from '@/api/avenir-esr'
import { EGroupType } from '@/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'

export const mockGroup: GroupDTO = {
  id: 'P1',
  name: 'Groupe formation 1',
  type: EGroupType.PROGRAM,
}

export const mockGroupOverview: GroupOverviewDTO = {
  id: 'PO1',
  name: 'Groupe option de formation 1',
  type: EGroupType.PROGRAM_OPTION,
  usersCount: 10,
}

export const mockGroupOverviewWithParent: GroupOverviewDTO = {
  id: 'SG1',
  name: 'Groupe ensemble d\'apprenant(e)s 1',
  type: EGroupType.STUDENT_GROUP,
  parentId: mockGroupOverview.id,
  parentName: mockGroupOverview.name,
  usersCount: 5,
}

function getGroupOverviewDTO (index: number): GroupOverviewDTO {
  let idPrefix: string
  let namePrefix: string
  let type: EGroupType
  let parentId: string | undefined
  let parentName: string | undefined

  if (index % 3 === 0) {
    idPrefix = 'PO'
    namePrefix = 'Option de formation '
    type = EGroupType.PROGRAM_OPTION
  }
  else if (index % 3 === 1) {
    idPrefix = 'SG'
    namePrefix = 'Ensemble d\'apprenant(e)s '
    type = EGroupType.STUDENT_GROUP
  }
  else {
    idPrefix = 'P'
    namePrefix = 'Formation '
    type = EGroupType.PROGRAM
  }

  if (type === EGroupType.STUDENT_GROUP) {
    parentId = `PO${index - 1}`
    parentName = `Groupe Option de formation ${index}`
  }

  return {
    id: `${idPrefix}${index + 1}`,
    name: `Groupe ${namePrefix}${index + 1}`,
    type,
    usersCount: index,
    parentId,
    parentName,
  }
}

export function createMockedGetGroupsResponse (
  getGroupsParams: GetGroupsParams,
  totalElements: number
): PagedResponseGroupOverviewDTO {
  const { keyword, type, page = 0, pageSize = PageSizes.FOUR } = getGroupsParams

  const mockedGroups = Array.from({ length: totalElements }, (_, index) => getGroupOverviewDTO(index))

  let filteredGroups = mockedGroups

  if (type) {
    filteredGroups = filteredGroups.filter(group => type.includes(group.type))
  }

  if (keyword?.trim()) {
    filteredGroups = filteredGroups.filter(group =>
      group.name.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedGroups = filteredGroups.slice(start, end)
  const totalPages = Math.ceil(filteredGroups.length / pageSize)

  return {
    data: paginatedGroups,
    page: { pageSize, totalElements: filteredGroups.length, totalPages, page }
  }
}

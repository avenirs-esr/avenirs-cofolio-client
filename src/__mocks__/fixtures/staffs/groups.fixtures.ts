import type { GetGroupsParams, GroupDTO, GroupOverviewDTO, GroupReferenceDTO, PagedResponseGroupOverviewDTO } from '@/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { EGroupType } from '@/api/avenir-esr'

export const mockGroup: GroupDTO = {
  id: 'P1',
  name: 'Groupe Formation 1',
  institution: {
    id: 'I1',
    name: 'Établissement 1',
  },
  type: EGroupType.PROGRAM,
  usersCount: 1,
}

export const mockGroupOverview: GroupOverviewDTO = {
  id: 'PO2',
  name: 'Groupe Option de formation 2',
  type: EGroupType.PROGRAM_OPTION,
  usersCount: 2,
}

export const mockGroupOverviewWithParent: GroupOverviewDTO = {
  id: 'SG3',
  name: 'Groupe Ensemble d\'apprenant(e)s 3',
  type: EGroupType.STUDENT_GROUP,
  parent: {
    id: mockGroupOverview.id,
    name: mockGroupOverview.name,
    type: mockGroupOverview.type
  },
  usersCount: 3,
}

export function getGroupDTO (id: string): GroupDTO {
  let namePrefix: string
  let type: EGroupType
  let parent: GroupReferenceDTO | undefined

  const idRegex = /^(PO|SG|P)(\d)/
  const match = id.match(idRegex)
  const idPrefix = match ? match[1] : id.slice(0, 2)
  let idIndex = Number.parseInt(match ? (match[2]) : id.slice(2))
  if (Number.isNaN(idIndex)) {
    idIndex = 1
  }

  if (idPrefix === 'PO') {
    namePrefix = 'Option de formation '
    type = EGroupType.PROGRAM_OPTION
  }
  else if (idPrefix === 'SG') {
    namePrefix = 'Ensemble d\'apprenant(e)s '
    type = EGroupType.STUDENT_GROUP
  }
  else {
    namePrefix = 'Formation '
    type = EGroupType.PROGRAM
  }

  if (type === EGroupType.STUDENT_GROUP) {
    parent = {
      id: `PO${idIndex - 1}`,
      name: `Groupe Option de formation ${idIndex - 1}`,
      type: EGroupType.PROGRAM_OPTION
    }
  }

  return {
    id: `${idPrefix}${idIndex}`,
    name: `Groupe ${namePrefix}${idIndex}`,
    institution: {
      id: `I1`,
      name: `Établissement 1`,
    },
    type,
    parent,
    usersCount: idIndex,
  }
}

function getGroupOverviewDTO (index: number): GroupOverviewDTO {
  let idPrefix: string
  let namePrefix: string
  let type: EGroupType
  let parent: GroupReferenceDTO | undefined

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
    parent = {
      id: `PO${index - 1}`,
      name: `Groupe Option de formation ${index - 1}`,
      type: EGroupType.PROGRAM_OPTION
    }
  }

  return {
    id: `${idPrefix}${index}`,
    name: `Groupe ${namePrefix}${index}`,
    type,
    usersCount: index,
    parent,
  }
}

export function generateGroupOverviewDTOs (count: number): GroupOverviewDTO[] {
  return Array.from({ length: count }, (_, index) => getGroupOverviewDTO(index))
}

export function createMockedGetGroupsResponse (
  getGroupsParams: GetGroupsParams,
  totalElements: number
): PagedResponseGroupOverviewDTO {
  const { keyword, types, page = 0, pageSize = PageSizes.FOUR } = getGroupsParams

  const mockedGroups = Array.from({ length: totalElements }, (_, index) => getGroupOverviewDTO(index))

  let filteredGroups = mockedGroups

  if (types && types.length > 0) {
    filteredGroups = filteredGroups.filter(group => types.includes(group.type))
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

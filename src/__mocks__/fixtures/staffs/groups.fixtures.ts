import type { GroupDTO, GroupOverviewDTO } from '@/api/avenir-esr'
import { EGroupType } from '@/api/avenir-esr'

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

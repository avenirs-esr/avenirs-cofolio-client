import type { GroupOverviewDTO } from '@/api/avenir-esr'

export interface GroupsListRow extends Omit<GroupOverviewDTO, 'parent'> {
  parentName?: string
}

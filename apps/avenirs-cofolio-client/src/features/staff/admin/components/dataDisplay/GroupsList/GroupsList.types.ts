import type { GroupOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'

export interface GroupsListRow extends Omit<GroupOverviewDTO, 'parent'> {
  parentName?: string
}

import type { GroupDTO } from '@/api/avenir-esr'
import { EGroupType } from '@/api/avenir-esr'

export const mockGroup: GroupDTO = {
  id: '1',
  name: 'Groupe formation 1',
  type: EGroupType.PROGRAM,
}

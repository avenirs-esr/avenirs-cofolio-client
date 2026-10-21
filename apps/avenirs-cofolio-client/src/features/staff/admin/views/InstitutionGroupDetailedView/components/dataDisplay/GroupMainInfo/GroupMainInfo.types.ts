import type { GroupDTO } from '@/api/avenir-esr'

export interface GroupMainInfoRow extends Omit<GroupDTO, | 'institution' | 'parent'> {
  institutionName: string
  parentName: string
}

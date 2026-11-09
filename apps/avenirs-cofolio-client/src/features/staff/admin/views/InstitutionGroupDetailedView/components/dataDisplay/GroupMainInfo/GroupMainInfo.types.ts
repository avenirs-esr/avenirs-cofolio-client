import type { GroupDTO } from '@avenirs-esr/shared/api/avenir-esr'

export interface GroupMainInfoRow extends Omit<GroupDTO, | 'institution' | 'parent'> {
  institutionName: string
  parentName: string
}

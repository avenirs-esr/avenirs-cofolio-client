import type { ExternalUserAffiliationOverviewDTO } from '@/api/avenir-esr'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'

export interface UsersListRow extends Pick<ExternalUserAffiliationOverviewDTO, 'id' | 'institutions'> {
  user: UserInfoType
  actions?: string
}

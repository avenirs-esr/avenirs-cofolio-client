import type { ExternalUserAffiliationOverviewDTO } from '@/api/avenir-esr'

export type UserInfoType = Pick<ExternalUserAffiliationOverviewDTO, 'id' | 'firstName' | 'lastName' | 'email' | 'profilePictureId'>

import type { ExternalUserAffiliationOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'

export type UserInfoType = Pick<ExternalUserAffiliationOverviewDTO, 'id' | 'firstName' | 'lastName' | 'email' | 'profilePictureId'>

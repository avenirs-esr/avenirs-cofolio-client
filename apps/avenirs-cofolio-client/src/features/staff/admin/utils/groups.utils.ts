import type { EGroupType, ExternalUserDetailDTO } from '@/api/avenir-esr'

export function getUserGroupsByType (user: ExternalUserDetailDTO, types: EGroupType | EGroupType[]) {
  const typesArray = Array.isArray(types) ? types : [types]
  return user.groups?.filter(group => typesArray.includes(group.type)) || []
}

export function getUserGroupsByTypeExcluding (user: ExternalUserDetailDTO, types: EGroupType | EGroupType[]) {
  const typesArray = Array.isArray(types) ? types : [types]
  return user.groups?.filter(group => !typesArray.includes(group.type)) || []
}

import { type DeclaredActivityAssociationDTO, EDeclaredActivityStatus } from '@/api/avenir-esr'

const NOT_DELETABLE_DECLARED_ACTIVITY_STATUS = new Set([EDeclaredActivityStatus.SUBMITTED, EDeclaredActivityStatus.COMPLETED])

export function isDeletableDeclaredActivityAssociation (association: DeclaredActivityAssociationDTO) {
  return !NOT_DELETABLE_DECLARED_ACTIVITY_STATUS.has(association.declaredActivity.status)
}

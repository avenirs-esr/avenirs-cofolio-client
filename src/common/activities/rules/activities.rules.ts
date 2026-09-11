import {
  type ActivityContentDTO,
  type ActivityPresentationDTO,
  type DeclaredActivityAssociationDTO,
  EDeclaredActivityStatus
} from '@/api/avenir-esr'
import {
  ACTIVITY_TRACE_SETTING_DISABLED_VALUE,
  ACTIVITY_TRACE_SETTING_INFINITY_VALUE
} from '@/features/staff/activities'

const NOT_DELETABLE_DECLARED_ACTIVITY_STATUSES = new Set([
  EDeclaredActivityStatus.SUBMITTED,
  EDeclaredActivityStatus.COMPLETED
])

export function isDeletableDeclaredActivityAssociation (association: DeclaredActivityAssociationDTO) {
  return !NOT_DELETABLE_DECLARED_ACTIVITY_STATUSES.has(association.declaredActivity.status)
}

export function isActivityAssociationToTraceLimited (activityContent: Partial<ActivityContentDTO>): boolean {
  return !isActivityAssociationToTraceUnlimited(activityContent) && !isActivityAssociationToTraceDisabled(activityContent)
}

export function isActivityAssociationToTraceUnlimited (activityContent: Partial<ActivityContentDTO>): boolean {
  const { traceAllowedAssociations } = activityContent
  return traceAllowedAssociations !== undefined
    && traceAllowedAssociations === ACTIVITY_TRACE_SETTING_INFINITY_VALUE
}

export function isActivityAssociationToTraceDisabled (activityContent: Partial<ActivityContentDTO>): boolean {
  const { traceAllowedAssociations } = activityContent
  return traceAllowedAssociations !== undefined
    && traceAllowedAssociations === ACTIVITY_TRACE_SETTING_DISABLED_VALUE
}

export function isActivitySubscribed (activity: Pick<ActivityPresentationDTO, 'subscribedDeclaredActivity' | 'subscribedDeclaredActivityStatus'>): boolean {
  return !!activity.subscribedDeclaredActivity
    && activity.subscribedDeclaredActivityStatus !== EDeclaredActivityStatus.UNSUBSCRIBED
}

export function isPerspectiveEditingDisabled (activityStatus?: EDeclaredActivityStatus): boolean {
  return activityStatus === EDeclaredActivityStatus.COMPLETED || activityStatus === EDeclaredActivityStatus.UNSUBSCRIBED
}

export function isDeclaredActivityUnsubscribed (activityStatus?: EDeclaredActivityStatus): boolean {
  return activityStatus === EDeclaredActivityStatus.UNSUBSCRIBED
}

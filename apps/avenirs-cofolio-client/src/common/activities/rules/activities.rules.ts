import type { ActivityContentDTO, ActivityPresentationDTO, DeclaredActivityAssociationDTO, FeedbackOverviewDTO } from '@/api/avenir-esr'
import type { AssociationLimitState } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import {
  EDeclaredActivityStatus,
  EFeedbackStatus
} from '@/api/avenir-esr'
import { ACTIVITY_TRACE_SETTING_DISABLED_VALUE, ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities'

const NOT_DELETABLE_DECLARED_ACTIVITY_STATUSES = new Set([EDeclaredActivityStatus.SUBMITTED, EDeclaredActivityStatus.COMPLETED])

export function shouldDisplayTraceLimit (limits: AssociationLimitState): boolean {
  return limits.isLoaded && limits.max !== ACTIVITY_TRACE_SETTING_DISABLED_VALUE
}

export function isDeletableDeclaredActivityAssociation (association: DeclaredActivityAssociationDTO) {
  return !NOT_DELETABLE_DECLARED_ACTIVITY_STATUSES.has(association.declaredActivity.status)
}

export function isActivityAssociationToTraceLimited (activityContent: Partial<ActivityContentDTO>): boolean {
  return !isActivityAssociationToTraceUnlimited(activityContent) && !isActivityAssociationToTraceDisabled(activityContent)
}

export function isActivityAssociationToTraceUnlimited (activityContent: Partial<ActivityContentDTO>): boolean {
  const { traceAllowedAssociations } = activityContent
  return traceAllowedAssociations !== undefined && traceAllowedAssociations === ACTIVITY_TRACE_SETTING_INFINITY_VALUE
}

export function isActivityAssociationToTraceDisabled (activityContent: Partial<ActivityContentDTO>): boolean {
  const { traceAllowedAssociations } = activityContent
  return traceAllowedAssociations !== undefined && traceAllowedAssociations === ACTIVITY_TRACE_SETTING_DISABLED_VALUE
}

export function isActivitySubscribed (
  activity: Pick<ActivityPresentationDTO, 'subscribedDeclaredActivity' | 'subscribedDeclaredActivityStatus'>,
): boolean {
  return !!activity.subscribedDeclaredActivity && activity.subscribedDeclaredActivityStatus !== EDeclaredActivityStatus.UNSUBSCRIBED
}

export function isPerspectiveEditingDisabled (activityStatus?: EDeclaredActivityStatus): boolean {
  return activityStatus === EDeclaredActivityStatus.COMPLETED || activityStatus === EDeclaredActivityStatus.UNSUBSCRIBED
}

export function isActivityPeriodEditingDisabled (activityStatus?: EDeclaredActivityStatus): boolean {
  return activityStatus === EDeclaredActivityStatus.COMPLETED || activityStatus === EDeclaredActivityStatus.UNSUBSCRIBED
}

export function isDeclaredActivityUnsubscribed (activityStatus?: EDeclaredActivityStatus): boolean {
  return activityStatus === EDeclaredActivityStatus.UNSUBSCRIBED
}

export function isDeclaredActivitySubmitted (activityStatus?: EDeclaredActivityStatus): boolean {
  return activityStatus === EDeclaredActivityStatus.SUBMITTED
}

export function hasPendingFeedback (feedbacks?: FeedbackOverviewDTO[]): boolean {
  return feedbacks?.some(feedback => feedback.status === EFeedbackStatus.NEW || feedback.status === EFeedbackStatus.IN_PROCESS) ?? false
}

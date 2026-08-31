import type { ActivityContentDTO, DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import { EFeedbackStatus } from '@/api/avenir-esr'
import {
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY,
} from '@/features/activities'

export function computeRemainingFeedbacks (declaredActivityDetails: DeclaredActivityDetailsDTO) {
  const { feedbackAllowedIterations } = declaredActivityDetails.activity
  const usedFeedbacks = declaredActivityDetails.feedbacks?.length ?? 0

  return feedbackAllowedIterations === -1
    ? -1
    : feedbackAllowedIterations - usedFeedbacks
}

export function canCreateFeedbackRequest (declaredActivityDetails: DeclaredActivityDetailsDTO, remainingFeedbacks: number) {
  const lastFeedback = declaredActivityDetails.feedbacks?.at(0)
  return remainingFeedbacks !== 0 && lastFeedback?.status !== EFeedbackStatus.IN_PROCESS
}

export function isActivityFeedbackRequestsUnlimited (activityContent: Partial<ActivityContentDTO>): boolean {
  const { feedbackAllowedIterations } = activityContent
  return feedbackAllowedIterations !== undefined
    && feedbackAllowedIterations === ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY
}

export function isActivityFeedbackRequestsDisabled (activityContent: Partial<ActivityContentDTO>): boolean {
  const { feedbackAllowedIterations } = activityContent
  return feedbackAllowedIterations !== undefined
    && feedbackAllowedIterations === ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED
}

export function isActivityFeedbackRequestsLimited (activityContent: Partial<ActivityContentDTO>): boolean {
  return !isActivityFeedbackRequestsUnlimited(activityContent) && !isActivityFeedbackRequestsDisabled(activityContent)
}

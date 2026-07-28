import { type DeclaredActivityAssociationDTO, type DeclaredActivityDetailsDTO, EDeclaredActivityStatus, EFeedbackStatus } from '@/api/avenir-esr'

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

const NOT_DELETABLE_DECLARED_ACTIVITY_STATUSES = new Set([
  EDeclaredActivityStatus.SUBMITTED,
  EDeclaredActivityStatus.COMPLETED
])

export function isDeletableDeclaredActivityAssociation (association: DeclaredActivityAssociationDTO) {
  return !NOT_DELETABLE_DECLARED_ACTIVITY_STATUSES.has(association.declaredActivity.status)
}

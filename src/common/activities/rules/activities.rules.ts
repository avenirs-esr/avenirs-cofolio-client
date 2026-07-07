import { type DeclaredActivityDetailsDTO, EFeedbackStatus } from '@/api/avenir-esr'

export function computeRemainingFeedbacks (declaredActivityDetails: DeclaredActivityDetailsDTO) {
  return declaredActivityDetails.activity.feedbackAllowedIterations - (declaredActivityDetails.feedbacks?.length ?? 0)
}

export function canCreateFeedbackRequest (declaredActivityDetails: DeclaredActivityDetailsDTO, remainingFeedbacks: number) {
  const lastFeedback = declaredActivityDetails.feedbacks?.at(0)
  return remainingFeedbacks !== 0 && lastFeedback?.status !== EFeedbackStatus.IN_PROCESS
}

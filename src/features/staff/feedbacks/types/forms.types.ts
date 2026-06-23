import type { AnyFormApi } from '@/common/types'
import type { useWriteFeedbackForm } from '@/features/staff/feedbacks/views/ActivityFeedbacksView/composables/use-write-feedback-form/use-write-feedback-form'

export type WriteFeedbackForm = ReturnType<typeof useWriteFeedbackForm>['form']

export interface WriteFeedbackFormData {
  feedback: string
}
export type WriteFeedbackFormApi = AnyFormApi<WriteFeedbackFormData>

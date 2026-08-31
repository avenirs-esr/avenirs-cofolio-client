import type { FileDTO } from '@/api/avenir-esr'
import type { AnyFormApi } from '@/common/types'
import type { useWriteFeedbackForm } from '@/features/feedbacks/views/ActivityFeedbackDetailsView/composables/use-write-feedback-form/use-write-feedback-form'

export type WriteFeedbackForm = ReturnType<typeof useWriteFeedbackForm>['form']

export interface WriteFeedbackFormData {
  feedback: string
  attachments: (File | FileDTO)[]
}
export type WriteFeedbackFormApi = AnyFormApi<WriteFeedbackFormData>

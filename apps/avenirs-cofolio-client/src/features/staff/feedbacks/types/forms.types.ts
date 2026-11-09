import type { AnyFormApi } from '@avenirs-esr/shared'
import type { FileDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { useWriteFeedbackForm } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/composables/use-write-feedback-form/use-write-feedback-form'

export type WriteFeedbackForm = ReturnType<typeof useWriteFeedbackForm>['form']

export interface WriteFeedbackFormData {
  feedback: string
  attachments: (File | FileDTO)[]
}
export type WriteFeedbackFormApi = AnyFormApi<WriteFeedbackFormData>

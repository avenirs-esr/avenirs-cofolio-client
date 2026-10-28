import type { AnyFormApi } from '@/common/types'
import type { useWriteAssessmentForm } from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/composables/use-write-assessment-form/use-write-assessment-form'

export type WriteAssessmentForm = ReturnType<typeof useWriteAssessmentForm>['form']

export interface WriteAssessmentFormData {
  grade: number | null
  validation: boolean | null
  comment: string
}
export type WriteAssessmentFormApi = AnyFormApi<WriteAssessmentFormData>

export enum WriteAssessmentFormDataValidationOption {
  VALIDATED = 'VALIDATED',
  NOT_VALIDATED = 'NOT_VALIDATED',
}

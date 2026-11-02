import type { ActivityAssessmentRequest } from '@/api/avenir-esr'
import type { EditActivityAssessmentFormData } from '@/features/staff/activities/types/forms.types'

export function toActivityAssessmentRequest ({
  assessmentComment,
  assessmentGrade,
  assessmentValidation
}: EditActivityAssessmentFormData): ActivityAssessmentRequest {
  return {
    ...(assessmentComment && { comment: true }),
    ...(assessmentGrade !== undefined && { grade: assessmentGrade }),
    ...(assessmentValidation && { validation: true }),
  }
}

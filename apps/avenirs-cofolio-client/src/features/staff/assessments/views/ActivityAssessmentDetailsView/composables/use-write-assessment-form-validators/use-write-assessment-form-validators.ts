import type { WriteAssessmentFormData } from '@/features/staff/assessments/types/forms.types'
import { useI18n } from 'vue-i18n'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { ASSESSMENT_COMMENT_MAX_LENGTH, ASSESSMENT_MIN_GRADE } from '@/features/staff/assessments/config'

/**
 * Composable providing validation functions for write assessment form fields.
 * The grade and the validation are always required when enabled; the comment is required
 * only when it is the single enabled option.
 * @returns An object containing validation functions for each form field.
 */
export function useWriteAssessmentFormValidators () {
  const { t } = useI18n()
  const { validateRequired, validateMin, validateMax, validateMaxLength } = useFormValidators()

  function validateGrade (grade: WriteAssessmentFormData['grade'], maxGrade: number) {
    const requiredError = validateRequired(grade?.toString())
    if (requiredError) {
      return requiredError
    }
    if (!Number.isInteger(grade)) {
      return t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.errors.integerGrade')
    }
    return validateMin(grade, ASSESSMENT_MIN_GRADE) || validateMax(grade, maxGrade)
  }

  function validateValidation (validation: WriteAssessmentFormData['validation']) {
    return validation === null ? t('global.error.form.requiredField') : undefined
  }

  function validateComment (comment: WriteAssessmentFormData['comment'], required: boolean) {
    return (required ? validateRequired(comment?.trim()) : undefined)
      || validateMaxLength(comment, ASSESSMENT_COMMENT_MAX_LENGTH)
  }

  return {
    validateGrade,
    validateValidation,
    validateComment
  }
}

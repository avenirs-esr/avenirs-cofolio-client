import type { WriteFeedbackFormData } from '@/features/staff/feedbacks/types/forms.types'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { FEEDBACK_MAX_LENGTH } from '@/features/staff/feedbacks/config'

/**
 * Composable providing validation functions for write feedback form fields.
 * @returns An object containing validation functions for each form field.
 */
export function useWriteFeedbackFormValidators () {
  const { validateRequired, validateMaxLength } = useFormValidators()

  function validateFeedback (feedback: WriteFeedbackFormData['feedback']) {
    return validateRequired(feedback) ?? validateMaxLength(feedback, FEEDBACK_MAX_LENGTH)
  }

  return {
    validateFeedback
  }
}

import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import {
  ACTIVITY_CONSIGN_MAX_LENGTH,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN,
  ACTIVITY_RECOMMENDED_COMPLETION_CONTEXTS_MAX_LENGTH,
  ACTIVITY_SUMMARY_MAX_LENGTH,
  ACTIVITY_TITLE_MAX_LENGTH
} from '@/features/staff/activities/config'

/**
 * Composable providing validation functions for edit national activity form fields.
 * It will be used in both add and edit declared activity forms.
 * @returns An object containing validation functions for each form field.
 */
export function useEditNationalActivityFormValidators () {
  const { validateRequired, validateMaxLength, validateMin } = useFormValidators()

  function validateTitle (title: EditActivityFormData['title']) {
    return validateRequired(title) ?? validateMaxLength(title, ACTIVITY_TITLE_MAX_LENGTH)
  }

  function validateSummary (summary: EditActivityFormData['summary']) {
    return validateRequired(summary) ?? validateMaxLength(summary, ACTIVITY_SUMMARY_MAX_LENGTH)
  }

  function validateDescription (description: EditActivityFormData['description']) {
    return validateMaxLength(description, ACTIVITY_CONSIGN_MAX_LENGTH)
  }

  function validateRecommendedCompletionContexts (recommendedCompletionContexts: EditActivityFormData['recommendedCompletionContexts']) {
    return validateMaxLength(recommendedCompletionContexts, ACTIVITY_RECOMMENDED_COMPLETION_CONTEXTS_MAX_LENGTH)
  }

  function validateFeedbackAllowedIterations (feedbackAllowedIterations: EditActivityFormData['feedbackAllowedIterations']) {
    if (
      feedbackAllowedIterations === undefined
      || feedbackAllowedIterations === ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED
      || feedbackAllowedIterations === ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY
    ) {
      return undefined
    }

    return validateMin(feedbackAllowedIterations, ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN)
  }

  return {
    validateDescription,
    validateRecommendedCompletionContexts,
    validateFeedbackAllowedIterations,
    validateSummary,
    validateTitle,
  }
}

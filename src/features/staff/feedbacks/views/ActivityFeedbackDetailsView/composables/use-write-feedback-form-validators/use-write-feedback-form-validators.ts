import type { WriteFeedbackFormData } from '@/features/staff/feedbacks/types/forms.types'
import { useFileValidation } from '@/common/composables/use-file-validation/use-file-validation'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import {
  FEEDBACK_ATTACHMENT_ACCEPTED_FILE_TYPES,
  FEEDBACK_ATTACHMENT_MAX_FILE_SIZE,
  FEEDBACK_MAX_LENGTH
} from '@/features/staff/feedbacks/config'

/**
 * Composable providing validation functions for write feedback form fields.
 * @returns An object containing validation functions for each form field.
 */
export function useWriteFeedbackFormValidators () {
  const { validateRequired, validateMaxLength } = useFormValidators()
  const { validateFile } = useFileValidation({
    acceptedFileTypes: [...FEEDBACK_ATTACHMENT_ACCEPTED_FILE_TYPES],
    maxSizeConfig: FEEDBACK_ATTACHMENT_MAX_FILE_SIZE,
    isRequired: false
  })

  function validateFeedback (feedback: WriteFeedbackFormData['feedback']) {
    return validateRequired(feedback) ?? validateMaxLength(feedback, FEEDBACK_MAX_LENGTH)
  }

  function validateAttachments (attachments: WriteFeedbackFormData['attachments']) {
    const errors = (attachments ?? [])
      .filter((attachment): attachment is File => attachment instanceof File)
      .map(validateFile)
      .filter((error): error is string => !!error)

    return errors.length ? [...new Set(errors)].join(' ') : undefined
  }

  return {
    validateFeedback,
    validateAttachments
  }
}

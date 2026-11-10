import type { EditTermsOfServiceFormData } from '@/features/terms-of-service/types/forms.types'
import { useFormValidators } from '@avenirs-esr/shared'

export function useUpdateTermsOfServiceFormValidators () {
  const { validateRequired } = useFormValidators()

  function validateDescription (description?: EditTermsOfServiceFormData['description']) {
    return validateRequired(description?.trim())
  }

  return {
    validateDescription,
  }
}

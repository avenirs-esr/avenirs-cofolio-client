import type { AlertUpdateFormData } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'
import { useFormValidators } from '@avenirs-esr/shared'

export function useUpdateAlertFormValidators () {
  const { validateRequired, validateDateInterval } = useFormValidators()

  function validateMessage (message: AlertUpdateFormData['message']) {
    return validateRequired(message?.trim())
  }

  function validateStartDate (startDate: AlertUpdateFormData['startDate'], endDate: AlertUpdateFormData['endDate']) {
    if (!endDate) {
      return undefined
    }

    return validateRequired(startDate)
  }

  function validateEndDate (endDate: AlertUpdateFormData['endDate'], startDate: AlertUpdateFormData['startDate']) {
    if (!startDate) {
      return undefined
    }

    return validateDateInterval({
      startDate,
      endDate,
      format: 'yyyy-MM-dd',
    })
  }

  return {
    validateMessage,
    validateStartDate,
    validateEndDate
  }
}

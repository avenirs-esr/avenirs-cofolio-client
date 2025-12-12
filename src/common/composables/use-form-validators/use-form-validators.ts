import isEmpty from 'lodash-es/isEmpty'
import { useI18n } from 'vue-i18n'

/**
 * useFormValidators returned result.
 */
export interface UseFormValidatorsReturn {
  /** Validates that a value is not empty */
  validateRequired: (value: string | undefined | null) => string | undefined
  /** Validates that a value does not exceed the maximum length */
  validateMaxLength: (value: string | undefined | null, maxLength: number) => string | undefined
}

/**
 * Vue composable to handle common form validation functions.
 *
 * This method provides :
 * - a method `validateRequired` that checks if a value is not empty,
 * - a method `validateMaxLength` that checks if a value does not exceed a maximum length.
 *
 * @returns {UseFormValidatorsReturn} Object containing :
 *  - `validateRequired` (function) : returns an error message if the value is empty, undefined otherwise,
 *  - `validateMaxLength` (function) : returns an error message if the value exceeds the max length, undefined otherwise.
 */
export function useFormValidators (): UseFormValidatorsReturn {
  const { t } = useI18n()

  function validateRequired (value: string | undefined | null): string | undefined {
    if (isEmpty(value)) {
      return t('global.error.form.requiredFiled')
    }
  }

  function validateMaxLength (value: string | undefined | null, maxLength: number): string | undefined {
    if (value && value.length > maxLength) {
      return t('global.error.form.maxLength', { maxLength })
    }
  }

  return {
    validateMaxLength,
    validateRequired
  }
}

import { isBefore, parse } from 'date-fns'
import isEmpty from 'lodash-es/isEmpty'
import { useI18n } from 'vue-i18n'

export interface validateDateIntervalArgs {
  startDate: string | undefined | null
  endDate: string | undefined | null
  format?: string
  isOnGoing?: boolean
}

/**
 * useFormValidators returned result.
 */
export interface UseFormValidatorsReturn {
  /** Validates that a value is not empty */
  validateRequired: (value: string | undefined | null) => string | undefined
  /** Validates that a value does not exceed the maximum length */
  validateMaxLength: (value: string | undefined | null, maxLength: number) => string | undefined
  /** Validates an interval where endDate can be null (ongoing). If endDate provided, it must be after startDate. */
  validateDateInterval: (args: validateDateIntervalArgs) => string | undefined
}

export interface ValidationOptions {
  isRequired?: boolean
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
 *  - `validateDateInterval` (function) : returns an error message if the end date is before the start date in an ongoing interval, undefined otherwise.
 */
export function useFormValidators (): UseFormValidatorsReturn {
  const { t } = useI18n()

  function validateRequired (value: string | undefined | null): string | undefined {
    if (isEmpty(value)) {
      return t('global.error.form.requiredField')
    }
  }

  function validateMaxLength (value: string | undefined | null, maxLength: number): string | undefined {
    if (value && value.length > maxLength) {
      return t('global.error.form.maxLength', { maxLength })
    }
  }

  function validateDateInterval ({ startDate, endDate, format = 'yyyy-MM-dd', isOnGoing = false }: validateDateIntervalArgs): string | undefined {
    const startRequiredError = validateRequired(startDate)
    if (startRequiredError) {
      return startRequiredError
    }

    if (!isOnGoing) {
      const endRequiredError = validateRequired(endDate)
      if (endRequiredError) {
        return endRequiredError
      }
    }

    if (!endDate) {
      return undefined
    }

    const parsedStartDate = parse(startDate as string, format, new Date())
    const parsedEndDate = parse(endDate as string, format, new Date())

    if (isBefore(parsedEndDate, parsedStartDate)) {
      return t('global.dates.endDateBeforeStartDate')
    }
  }

  return {
    validateMaxLength,
    validateRequired,
    validateDateInterval
  }
}

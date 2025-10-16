import type { AvLocale } from '@/types'
import { formatDateLocalized, formatTimeLocalized } from '@/common/utils'
import { useI18n } from 'vue-i18n'

/**
 * Result returned by the useDateUtils composable.
 */
interface UseDateUtilsReturn {
  /**
   * Formats a given date string into a localized date and time string,
   * including the translation of the word “at” (e.g., "12 October 2025 at 14:32").
   *
   * @example
   * ```ts
   * const { formatTranslatedDateTime } = useDateUtils()
   *
   * const result = formatTranslatedDateTime('2025-10-15T14:32:00Z')
   * // Example output (depending on locale): "15 octobre 2025 à 16:32"
   * ```
   */
  formatTranslatedDateTime: (date: string) => string
}

/**
 * Vue composable to handle date and time localization and formatting.
 *
 * This composable provides helper methods to format date and time values
 * according to the current user locale using `date-fns` under the hood.
 * It integrates with `vue-i18n` to include translated connectors such as
 * the localized “at” word between date and time.
 *
 * @example
 * ```ts
 * import { useDateUtils } from '@/common/composables'
 *
 * const { formatTranslatedDateTime } = useDateUtils()
 *
 * const createdAt = '2025-10-15T14:32:00Z'
 * const formatted = formatTranslatedDateTime(createdAt)
 * console.log(formatted)
 * // → "15 octobre 2025 à 16:32" (for French locale)
 * ```
 *
 * @returns {UseDateUtilsReturn} Object containing:
 *  - `formatTranslatedDateTime`: function to format a date string into a localized "date at time" format.
 */
export function useDateUtils (): UseDateUtilsReturn {
  const { t, locale } = useI18n()
  const currentLocale = computed(() => locale.value as AvLocale)

  const formatTranslatedDateTime = (date: string) => {
    const formattedDate = formatDateLocalized(date, currentLocale.value)
    const formattedTime = formatTimeLocalized(date, currentLocale.value)
    return t('global.dates.dateTimeAt', {
      date: formattedDate,
      time: formattedTime
    })
  }

  return {
    formatTranslatedDateTime
  }
}

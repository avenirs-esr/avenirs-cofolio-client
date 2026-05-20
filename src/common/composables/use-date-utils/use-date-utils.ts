import type { AvLocale } from '@/types'
import { formatDateLocalized, formatTimeLocalized } from '@/common/utils'
import { differenceInHours, differenceInMinutes, format, isToday } from 'date-fns'
import { useI18n } from 'vue-i18n'

/**
 * Result returned by the useDateUtils composable.
 */
interface UseDateUtilsReturn {
  /**
   * Formats a given ISO date string into a human-readable "last modified" string.
   * Example for French locale
   * - If the date is **today** and modified **≥ 1 hour ago**: returns `"Il y a X heure(s)"`
   * - If the date is **today** and modified **≥ 1 minute ago**: returns `"Il y a X minute(s)"`
   * - If the date is **today** and modified **< 1 minute ago**: returns `"À l'instant"`
   * - If the date is **not today**: returns `"JJ/MM/YYYY"`
   *
   * @param date - ISO 8601 date string (e.g. `"2025-10-15T14:32:00Z"`)
   * @returns Formatted string according to the rules above.
   *
   * @example
   * ```ts
   * const { formatLastModified } = useDateUtils()
   *
   * formatLastModified(subHours(new Date(), 2).toISOString())
   * // → "Il y a 2 heures"
   *
   * formatLastModified(subMinutes(new Date(), 30).toISOString())
   * // → "Il y a 30 minutes"
   *
   * formatLastModified(subSeconds(new Date(), 30).toISOString())
   * // → "À l'instant"
   *
   * formatLastModified('2024-01-15T14:30:00Z')
   * // → "15/01/2024"
   * ```
   */
  formatLastModified: (date: string) => string

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
 *  - `formatLastModified`: function to format a date as a human-readable "last modified" string.
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

  const formatLastModified = (date: string) => {
    const parsedDate = new Date(date)

    if (isToday(parsedDate)) {
      const now = new Date()
      const hours = differenceInHours(now, parsedDate)
      if (hours >= 1) {
        return t('global.dates.hoursAgo', { count: hours }, hours)
      }
      const minutes = differenceInMinutes(now, parsedDate)
      if (minutes >= 1) {
        return t('global.dates.minutesAgo', { count: minutes }, minutes)
      }
      return t('global.dates.justNow')
    }

    return format(parsedDate, 'dd/MM/yyyy')
  }

  return {
    formatLastModified,
    formatTranslatedDateTime
  }
}

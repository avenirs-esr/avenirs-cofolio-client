import type { AvLocale } from '@/types'
import { formatDateLocalized, formatTimeLocalized, parseDate } from '@/common/utils'
import { type DateArg, differenceInCalendarDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInWeeks, differenceInYears } from 'date-fns'
import { useI18n } from 'vue-i18n'

/**
 * Result returned by the useDateUtils composable.
 */
interface UseDateUtilsReturn {
  /**
   * Formats a given date into a human-readable "last modified" string.
   *
   * Non-compact mode:
   * - If modified **< 1 minute ago**: returns a localized "just now" string
   * - If modified **< 1 hour ago**: returns a localized "X minutes ago" string
   * - If modified **today**: returns a localized "X hours ago" string
   * - Otherwise: returns the localized formatted date
   *
   * Compact mode:
   * - If modified **< 1 minute ago**: returns a localized "just now" string
   * - If modified **< 1 hour ago**: returns a compact localized minutes string
   * - If modified **< 1 day ago**: returns a compact localized hours string
   * - If modified **< 7 days ago**: returns a compact localized days string
   * - If modified **< 4 weeks ago**: returns a compact localized weeks string
   * - If modified **< 12 months ago**: returns a compact localized months string
   * - Otherwise: returns a compact localized years string
   *
   * @param date - Date value accepted by date-fns (`Date`, ISO string, timestamp, ...)
   * @param compact - Whether to use the compact format (`false` by default)
   * @returns Formatted string according to the current locale
   *
   * @example
   * ```ts
   * const { formatLastModified } = useDateUtils()
   *
   * formatLastModified(subHours(new Date(), 2))
   * // "Il y a 2 heures"
   *
   * formatLastModified(subHours(new Date(), 2), true)
   * // "2 h"
   *
   * formatLastModified(subMinutes(new Date(), 30))
   * // "Il y a 30 minutes"
   *
   * formatLastModified(subMinutes(new Date(), 30), true)
   * // "30 min"
   *
   * formatLastModified(subSeconds(new Date(), 30))
   * // "À l'instant"
   *
   * formatLastModified(subSeconds(new Date(), 30), true)
   * // "À l'instant"
   *
   * formatLastModified('2024-01-15T14:30:00Z')
   * // "15/01/2024"
   *
   * formatLastModified('2024-01-15T14:30:00Z', compact)
   * // "2 ans"
   * ```
   */
  formatLastModified: (date: DateArg<Date>, compact?: boolean) => string

  /**
   * Formats a given date string into a localized date and time string.
   *
   * @param date - Date value accepted by date-fns (`Date`, ISO string, timestamp, ...)
   * @param compact - Whether to use the compact format (`false` by default)
   * @returns Localized "date at time" string
   *
   * @example
   * ```ts
   * const { formatTranslatedDateTime } = useDateUtils()
   *
   * const result = formatTranslatedDateTime('2025-10-15T14:32:00Z')
   * // fr: "15 octobre 2025 à 16:32"
   * // en: "October 15, 2025 at 4:32 PM"
   *
   * const result = formatTranslatedDateTime('2025-10-15T14:32:00Z', true)
   * // fr: "15/10/2025 à 16:32"
   * // en: "10/15/2025 at 16:32"
   * ```
   */
  formatTranslatedDateTime: (date: DateArg<Date>, compact?: boolean) => string
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

  const formatTranslatedDateTime = (date: DateArg<Date>, compact: boolean = false): string => {
    const formattedDate = formatDateLocalized(date, currentLocale.value, compact)
    const formattedTime = formatTimeLocalized(date, currentLocale.value, compact)
    return t('global.dates.dateTimeAt', {
      date: formattedDate,
      time: formattedTime
    })
  }

  const formatLastModified = (date: DateArg<Date>, compact: boolean = false): string => {
    const parsedDate = parseDate(date)
    const now = new Date()

    const minutes = differenceInMinutes(now, parsedDate)
    if (minutes < 1) {
      return t('global.dates.justNow')
    }

    const hours = differenceInHours(now, parsedDate)
    if (hours < 1) {
      return t(compact ? 'global.dates.compact.minutes' : 'global.dates.minutesAgo', { count: minutes })
    }

    const days = differenceInCalendarDays(now, parsedDate)
    if (days < 1) {
      return t(compact ? 'global.dates.compact.hours' : 'global.dates.hoursAgo', { count: hours })
    }

    if (!compact) {
      return formatDateLocalized(parsedDate, currentLocale.value, true)
    }

    if (days < 7) {
      return t('global.dates.compact.days', { count: days })
    }

    const weeks = differenceInWeeks(now, parsedDate)
    if (weeks < 4) {
      return t('global.dates.compact.weeks', { count: weeks })
    }

    const months = differenceInMonths(now, parsedDate)
    if (months < 12) {
      return t('global.dates.compact.months', { count: months })
    }

    const years = differenceInYears(now, parsedDate)
    return t('global.dates.compact.years', { count: years })
  }

  return {
    formatLastModified,
    formatTranslatedDateTime
  }
}

import type { AvLocale } from '@/types/i18n.types'
import { differenceInDays, format, getDate, isValid, type Locale, parse, parseISO, startOfDay } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'

const localesMap: Record<AvLocale, Locale> = {
  fr,
  en: enUS,
}

/**
 *
 * @param date yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd\'T\'HH:mm:ss | yyyy-MM-dd\'T\'HH:mm | yyyy-MM-dd
 * @returns Date
 */
export function parseDateISO (date: string): Date {
  const parsed = parseISO(date)
  if (isValid(parsed)) {
    return parsed
  }

  const fallback = new Date(date)
  if (isValid(fallback)) {
    return fallback
  }

  throw new Error(`Invalid ISO date: ${date}`)
}

/**
 *
 * @param date yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd\'T\'HH:mm:ss | yyyy-MM-dd\'T\'HH:mm | yyyy-MM-dd
 * @param localeCode
 * @returns date formated to locale string
 */
export function formatDateToLocaleString (date: string, localeCode: AvLocale): string {
  const parsedDate = parseDateISO(date)
  const locale = localesMap[localeCode]

  const formatByLocale: Record<AvLocale, string> = {
    fr: 'd MMMM yyyy',
    en: 'MMMM d, yyyy',
  }

  const selectedFormat = formatByLocale[localeCode]

  return format(parsedDate, selectedFormat, { locale })
}

/**
 *
 * @param date yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd\'T\'HH:mm:ss | yyyy-MM-dd\'T\'HH:mm | yyyy-MM-dd
 * @param localeCode
 * @returns first letters of month
 */
export function getLocalizedAbbrMonth (date: string, localeCode: AvLocale): string {
  const parsedDate = parseDateISO(date)
  const locale = localesMap[localeCode]
  return format(parsedDate, 'MMM', { locale })
}

/**
 *
 * @param date yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd\'T\'HH:mm:ss | yyyy-MM-dd\'T\'HH:mm | yyyy-MM-dd
 * @returns day number
 */
export function getCalendarDate (date: string) {
  const parsedDate = parseDateISO(date)
  return getDate(parsedDate)
}

/**
 *
 * @param date
 * @returns days until date
 */
export function getDaysUntil (date: Date): number {
  const today = startOfDay(new Date())
  const target = startOfDay(date)

  return differenceInDays(target, today)
}

/**
 * Formats a date string to a localized date format (day month year)
 * @param date yyyy-MM-dd'T'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd'T'HH:mm:ss | yyyy-MM-dd'T'HH:mm | yyyy-MM-dd
 * @param localeCode The locale to use for formatting of type AvLocale
 * @returns Formatted date string (e.g., "15 janvier 2025" for fr, "15 January 2025" for en)
 */
export function formatDateLocalized (date: string, localeCode: AvLocale): string {
  const parsedDate = new Date(date)
  return format(parsedDate, 'dd MMMM yyyy', {
    locale: localesMap[localeCode]
  })
}

/**
 * Formats a date string to a localized time format (24-hour)
 * @param date yyyy-MM-dd'T'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd'T'HH:mm:ss | yyyy-MM-dd'T'HH:mm | yyyy-MM-dd
 * @param localeCode The locale to use for formatting of type AvLocale
 * @returns Formatted time string in 24-hour format (e.g., "14:30")
 */
export function formatTimeLocalized (date: string, localeCode: AvLocale): string {
  const parsedDate = new Date(date)
  return format(parsedDate, 'HH:mm', {
    locale: localesMap[localeCode]
  })
}
/**
 * Formats a year-month string to date format with day
 * @param date yyyy-MM (e.g., "2025-02")
 * @returns Formatted date string (e.g., "2025-02-01")
 */
export function formatYearMonthToDate (date: string): string {
  const parsedDate = parse(date, 'yyyy-MM', new Date())
  return format(parsedDate, 'yyyy-MM-dd')
}

/**
 * Formats a date string (any supported ISO-like format) to a year-month string `yyyy-MM`.
 * @param date yyyy-MM-dd'T'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd'T'HH:mm:ss | yyyy-MM-dd'T'HH:mm | yyyy-MM-dd | yyyy-MM
 * @returns Formatted year-month string (e.g., "2025-02")
 */
export function formatDateToYearMonth (date: string): string {
  const parsedDate = parseDateISO(date)
  return format(parsedDate, 'yyyy-MM')
}

import type { AvLocale } from '@/types/i18n.types'
import { type DateArg, differenceInDays, format, getDate, isValid, type Locale, parse, parseISO, startOfDay } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'

const localesMap: Record<AvLocale, Locale> = {
  fr,
  en: enUS,
}

/**
 * @param date ISO string: yyyy-MM-dd'T'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd'T'HH:mm:ss | yyyy-MM-dd'T'HH:mm | yyyy-MM-dd
 * @returns Parsed Date object
 * @throws {Error} If the string cannot be parsed into a valid date
 */
function parseDateISO (date: string): Date {
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
 * Parses a DateInput (Date object, timestamp, or ISO string) into a Date object.
 *
 * Note: date-fns `toDate` might be removed in the near future.
 *
 * @param date Date object, timestamp (number), or ISO string: yyyy-MM-dd'T'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd'T'HH:mm:ss | yyyy-MM-dd'T'HH:mm | yyyy-MM-dd
 * @returns Parsed Date object
 * @throws {Error} If a string input cannot be parsed into a valid date
 */
export function parseDate (date: DateArg<Date>): Date {
  switch (typeof date) {
    case 'string':
      return parseDateISO(date)
    case 'number':
      return new Date(date)
    default:
      return date
  }
}

/**
 *
 * @param date yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd\'T\'HH:mm:ss | yyyy-MM-dd\'T\'HH:mm | yyyy-MM-dd
 * @returns day number
 */
export function getCalendarDate (date: DateArg<Date>) {
  const parsedDate = parseDate(date)
  return getDate(parsedDate)
}

/**
 *
 * @param date
 * @returns days until date
 */
export function getDaysUntil (date: DateArg<Date>): number {
  const today = startOfDay(new Date())
  const target = startOfDay(date)

  return differenceInDays(target, today)
}

/**
 * @param date Date object, timestamp (number), or ISO string: yyyy-MM-dd'T'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd'T'HH:mm:ss | yyyy-MM-dd'T'HH:mm | yyyy-MM-dd
 * @param localeCode The locale to use
 * @param formats A format pattern per locale (e.g. { fr: 'dd/MM/yyyy', en: 'MM/dd/yyyy' })
 * @returns Formatted date string
 */
function formatLocalized (date: DateArg<Date>, localeCode: AvLocale, formats: string | Record<AvLocale, string>): string {
  return format(parseDate(date), typeof formats === 'string' ? formats : formats[localeCode], { locale: localesMap[localeCode] })
}

/**
 * Formats a date string to a localized date format (day month year).
 *
 * @param date Date object, timestamp (number), or ISO string: yyyy-MM-dd'T'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd'T'HH:mm:ss | yyyy-MM-dd'T'HH:mm | yyyy-MM-dd
 * @param localeCode The locale to use
 * @param compact When true, returns a short format instead of the full one
 * @returns Formatted date string
 *   - full: "15 janvier 2025" (fr) / "January 15, 2025" (en)
 *   - compact: "15/01/2025" (fr) / "01/15/2025" (en)
 */
export function formatDateLocalized (date: DateArg<Date>, localeCode: AvLocale, compact: boolean = false): string {
  return formatLocalized(date, localeCode, compact
    ? {
        fr: 'dd/MM/yyyy',
        en: 'MM/dd/yyyy',
      }
    : {
        fr: 'd MMMM yyyy',
        en: 'MMMM d, yyyy',
      })
}

/**
 * Formats a year-month string to date format with day
 * Formats a date string to a localized time format.
 *
 * @param date Date object, timestamp (number), or ISO string: yyyy-MM-dd'T'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd'T'HH:mm:ss | yyyy-MM-dd'T'HH:mm | yyyy-MM-dd
 * @param localeCode The locale to use
 * @param compact When true, always returns 24-hour format regardless of locale
 * @returns Formatted time string
 *   - full: "14:30" (fr) / "2:30 PM" (en)
 *   - compact: "14:30" (fr & en)
 */
export function formatTimeLocalized (date: DateArg<Date>, localeCode: AvLocale, compact: boolean = false): string {
  return formatLocalized(date, localeCode, compact
    ? 'HH:mm'
    : {
        fr: 'HH:mm',
        en: 'h:mm a'
      })
}

/**
 *
 * @param date yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd\'T\'HH:mm:ss | yyyy-MM-dd\'T\'HH:mm | yyyy-MM-dd
 * @param localeCode
 * @returns first letters of month
 */
export function getLocalizedAbbrMonth (date: DateArg<Date>, localeCode: AvLocale): string {
  return formatLocalized(date, localeCode, 'MMM')
}

/**
 * Formats a year-month string to date format with day.
 *
 * @param date yyyy-MM (e.g., "2025-02")
 * @returns Formatted date string (e.g., "2025-02-01")
 */
export function formatYearMonthToDate (date: string): string {
  const parsedDate = parse(date, 'yyyy-MM', new Date())
  return format(parsedDate, 'yyyy-MM-dd')
}

/**
 * Formats a date string (any supported ISO-like format) to a year-month string `yyyy-MM`.
 *
 * @param date yyyy-MM-dd'T'HH:mm:ss.SSSxxx | yyyy-MM-dd'T'HH:mm:ssXX | yyyy-MM-dd'T'HH:mm:ss | yyyy-MM-dd'T'HH:mm | yyyy-MM-dd | yyyy-MM
 * @returns Formatted year-month string (e.g., "2025-02")
 */
export function formatDateToYearMonth (date: string): string {
  const parsedDate = parseDateISO(date)
  return format(parsedDate, 'yyyy-MM')
}

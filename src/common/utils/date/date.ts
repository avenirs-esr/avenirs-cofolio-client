import type { AvLocale } from '@/types/i18n.types'
import { format, getDate, isValid, type Locale, parseISO } from 'date-fns'
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
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)

  const diffTime = target.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

import type { AvLocale } from '@/types/i18n.types'
import { format, isValid, type Locale, parse } from 'date-fns'
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
  const formats = [
    'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
    'yyyy-MM-dd\'T\'HH:mm:ssXXX',
    'yyyy-MM-dd\'T\'HH:mm:ss',
    'yyyy-MM-dd\'T\'HH:mm',
    'yyyy-MM-dd'
  ]

  for (const format of formats) {
    const parsed = parse(date, format, new Date())
    if (isValid(parsed)) {
      return parsed
    }
  }

  const fallback = new Date(date)
  if (isValid(fallback)) {
    return fallback
  }

  throw new Error(`Invalid ISO date: ${date}`)
}

/**
 *
 * @param date
 * @param localeCode
 * @returns date formated to locale string
 */
export function formatDateToLocaleString (date: Date, localeCode: AvLocale): string {
  const locale = localesMap[localeCode] || fr

  const formatByLocale: Record<AvLocale, string> = {
    fr: 'd MMMM yyyy',
    en: 'MMMM d, yyyy',
  }

  const selectedFormat = formatByLocale[localeCode] || formatByLocale.fr

  return format(date, selectedFormat, { locale })
}

/**
 *
 * @param date
 * @param localeCode
 * @returns first letters of month
 */
export function getLocalizedAbbrMonth (date: Date, localeCode: AvLocale): string {
  const locale = localesMap[localeCode] || fr
  return format(date, 'MMM', { locale })
}

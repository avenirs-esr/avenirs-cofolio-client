import { format, type Locale, parse } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'

const localesMap: Record<string, Locale> = {
  fr,
  en: enUS,
}

/**
 *
 * @param date "DD/MM/YYYY"
 * @returns Date
 */
export function parseDateFR (date: string): Date {
  return parse(date, 'dd/MM/yyyy', new Date())
}

/**
 *
 * @param date
 * @param localeCode
 * @returns date formated to locale string
 */
export function formatDateToLocaleString (date: Date, localeCode: string): string {
  const locale = localesMap[localeCode] || fr

  const formatByLocale: Record<string, string> = {
    fr: 'd MMMM yyyy',
    en: 'MMMM d, yyyy',
  }

  const selectedFormat = formatByLocale[localeCode] || formatByLocale.fr

  return format(date, selectedFormat, { locale })
}

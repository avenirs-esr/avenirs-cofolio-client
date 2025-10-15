import type { AvLocale } from '@/types'
import { format } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import { useI18n } from 'vue-i18n'

export function useDateUtils () {
  const { t, locale } = useI18n()
  const currentLocale: AvLocale = locale.value as AvLocale

  const formatTranslatedDateTime = (date: string) => {
    const createdAtDate = new Date(date)
    return format(createdAtDate, `dd MMMM yyyy '${t('global.at')}' HH:mm`, {
      locale: currentLocale === 'fr' ? fr : enUS
    })
  }

  return {
    formatTranslatedDateTime
  }
}

<script lang="ts" setup>
import type { AvLocale } from '@/types'
import { formatDateToYearMonthLocalized } from '@/common/utils'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface PeriodBadgeProps {
  /**
   * The start date of the period.
   */
  startDate: string

  /**
   * The end date of the period.
   */
  endDate?: string
}

const { startDate, endDate = undefined } = defineProps<PeriodBadgeProps>()

const { t, locale } = useI18n()
const currentLocale = computed(() => locale.value as AvLocale)

const startDateFormatted = formatDateToYearMonthLocalized(startDate, currentLocale.value)
const endDateFormatted = computed(() => endDate
  ? formatDateToYearMonthLocalized(endDate, currentLocale.value)
  : t('global.dates.ongoing'))

const avBadgeProps = computed(() => ({
  label: `${startDateFormatted} - ${endDateFormatted.value}`,
  color: endDate ? 'var(--text1)' : 'var(--dark-background-primary1)',
  backgroundColor: endDate ? 'var(--light-background-neutral)' : 'var(--light-background-primary2)'
}))
</script>

<template>
  <AvBadge v-bind="avBadgeProps" />
</template>

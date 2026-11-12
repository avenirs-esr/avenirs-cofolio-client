<script lang="ts" setup>
import type { AvBadgeProps } from '@avenirs-esr/avenirs-dsav'
import type { DateArg } from 'date-fns'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AlertStatusBadgeProps {
  active: boolean | undefined
  startDate: DateArg<Date> | undefined
  endDate: DateArg<Date> | undefined
}

const { active, startDate, endDate } = defineProps<AlertStatusBadgeProps>()

const { t } = useI18n()

const status = computed(() => {
  const now = new Date()

  if (active) {
    return 'ACTIVE'
  }

  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) {
      return 'PROGRAMMED'
    }

    if (now >= start && now <= end) {
      return 'ACTIVE'
    }
  }

  return 'INACTIVE'
})

const avBadgeProps = computed<AvBadgeProps>(() => {
  switch (status.value) {
    case 'ACTIVE':
      return {
        color: 'var(--light-foreground-success)',
        backgroundColor: 'var(--light-background-success)',
        label: t('global-alert.views.AlertDetailsView.components.badges.AlertStatusBadge.ACTIVE'),
        icon: MDI_ICONS.CHECK_CIRCLE_OUTLINE
      }
    case 'PROGRAMMED':
      return {
        color: 'var(--light-foreground-info)',
        backgroundColor: 'var(--light-background-info)',
        label: t('global-alert.views.AlertDetailsView.components.badges.AlertStatusBadge.PROGRAMMED'),
        icon: MDI_ICONS.CALENDAR_CLOCK_OUTLINE
      }
    case 'INACTIVE':
    default:
      return {
        color: 'var(--light-foreground-error)',
        backgroundColor: 'var(--light-background-error)',
        label: t('global-alert.views.AlertDetailsView.components.badges.AlertStatusBadge.INACTIVE'),
        icon: MDI_ICONS.CLOSE_CIRCLE_OUTLINE
      }
  }
})
</script>

<template>
  <AvBadge v-bind="avBadgeProps" />
</template>

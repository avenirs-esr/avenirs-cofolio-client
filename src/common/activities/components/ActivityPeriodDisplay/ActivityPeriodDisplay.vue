<script setup lang="ts">
import type { AvLocale } from '@/types'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import { formatDateLocalized, parseDate } from '@/common/utils'
import { RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityPeriodDisplayProps {
  startDate?: string
  endDate?: string
}
const { startDate, endDate } = defineProps<ActivityPeriodDisplayProps>()
const { locale, t } = useI18n()

const period = computed(() => [
  ...(startDate ? [formatDateLocalized(parseDate(startDate), locale.value as AvLocale, true)] : []),
  ...(endDate ? [formatDateLocalized(parseDate(endDate), locale.value as AvLocale, true)] : []),
].join(' - '))
</script>

<template>
  <IconTitleCardContainer
    :title-icon="RI_ICONS.TIMER_LINE"
    data-testid="activity-period-input"
    :title="t('global.activities.components.ActivityPeriodDisplay.title')"
  >
    <span class="s2-regular">
      {{ period }}
    </span>
  </IconTitleCardContainer>
</template>

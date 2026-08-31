<script setup lang="ts">
import { AvBadge, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityPeriodBadgeProps {
  small?: boolean
}

defineProps<ActivityPeriodBadgeProps>()

const { t } = useI18n()
</script>

<template>
  <AvBadge
    v-bind="$props"
    :label="t('student.buildProject.views.projectActivitiesView.ActivityLibraryCard.period')"
    :icon="RI_ICONS.TIMER_LINE"
    color="var(--text1)"
    background-color="var(--surface-background)"
    border-color="var(--stroke)"
  />
</template>

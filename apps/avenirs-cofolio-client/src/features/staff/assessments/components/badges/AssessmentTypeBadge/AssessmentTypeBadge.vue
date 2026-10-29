<script setup lang="ts">
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityTypeBadgeProps {
  activityType: string
}

const { activityType } = defineProps<ActivityTypeBadgeProps>()

const { t } = useI18n()

const label = computed(() => t(`staff.assessments.badges.activityType.${activityType}`))
</script>

<template>
  <AvBadge
    data-testid="activity-type-badge"
    :data-type="activityType"
    :label="label"
    background-color="var(--light-background-neutral)"
    color="var(--text1)"
    border-color="var(--stroke)"
  />
</template>

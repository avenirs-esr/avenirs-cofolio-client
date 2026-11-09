<script setup lang="ts">
import type { EActivityAssessmentType } from '@avenirs-esr/shared/api/avenir-esr'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityTypeBadgeProps {
  assessmentType: EActivityAssessmentType
}

const { assessmentType } = defineProps<ActivityTypeBadgeProps>()

const { t } = useI18n()

const label = computed(() => t(`staff.assessments.badges.activityType.${assessmentType}`))
</script>

<template>
  <AvBadge
    data-testid="activity-type-badge"
    :data-type="assessmentType"
    :label="label"
    background-color="var(--light-background-neutral)"
    color="var(--text1)"
    border-color="var(--stroke)"
  />
</template>

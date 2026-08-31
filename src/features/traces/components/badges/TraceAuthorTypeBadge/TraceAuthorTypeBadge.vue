<script lang="ts" setup>
import type { ETraceAuthorType } from '@/api/avenir-esr'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface TraceAuthorTypeBadgeProps {
  authorType: ETraceAuthorType
}

const { authorType } = defineProps<TraceAuthorTypeBadgeProps>()

const { t } = useI18n()

const label = computed(() => t(`student.traces.badges.TraceAuthorTypeBadge.${authorType}`))
</script>

<template>
  <AvBadge
    :label="label"
    color="var(--text1)"
    background-color="var(--card)"
    border-color="var(--other-border-skill-card)"
    :icon="MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE"
    small
    ellipsis
    data-testid="trace-author-type-badge"
  />
</template>

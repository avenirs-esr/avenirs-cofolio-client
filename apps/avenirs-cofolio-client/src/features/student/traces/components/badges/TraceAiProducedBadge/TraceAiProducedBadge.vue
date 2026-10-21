<script lang="ts" setup>
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface TraceAiProducedBadgeProps {
  aiProduced: boolean
}

const { aiProduced } = defineProps<TraceAiProducedBadgeProps>()

const { t } = useI18n()

const avBadgeProps = computed(() => ({
  label: aiProduced
    ? t('student.traces.badges.TraceAiProducedBadge.withAi')
    : t('student.traces.badges.TraceAiProducedBadge.withoutAi'),
  color: aiProduced ? 'var(--contrast-foreground)' : 'var(--text1)',
  backgroundColor: aiProduced ? 'var(--light-foreground-critical)' : 'var(--surface-background)',
  borderColor: aiProduced ? 'transparent' : 'var(--other-border-skill-card)',
}))
</script>

<template>
  <AvBadge
    v-bind="avBadgeProps"
    :icon="MDI_ICONS.FLARE"
    small
    ellipsis
    data-testid="trace-ai-produced-badge"
  />
</template>

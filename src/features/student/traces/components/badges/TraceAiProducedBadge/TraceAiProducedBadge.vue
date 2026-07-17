<script lang="ts" setup>
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <AvBadge
    :label="t('student.traces.badges.TraceAiProducedBadge.label')"
    color="var(--contrast-foreground)"
    background-color="var(--light-foreground-critical)"
    border-color="transparent"
    :icon="MDI_ICONS.FLARE"
    small
    ellipsis
    data-testid="trace-ai-produced-badge"
  />
</template>

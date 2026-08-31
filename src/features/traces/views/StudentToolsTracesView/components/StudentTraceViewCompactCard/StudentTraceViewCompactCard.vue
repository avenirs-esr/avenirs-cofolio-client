<script lang="ts" setup>
import type { TraceViewDTO } from '@/api/avenir-esr'
import CompactCard from '@/features/global/components/cards/CompactCard/CompactCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface StudentTraceViewCompactCardProps {
  trace: TraceViewDTO
}

const { trace } = defineProps<StudentTraceViewCompactCardProps>()
</script>

<template>
  <CompactCard
    :element="{ id: trace.id, title: trace.title }"
    :icon="MDI_ICONS.ATTACH_FILE"
    color="var(--text1)"
    icon-color="var(--text1)"
    background-color="var(--surface-background)"
    border-color="var(--other-border-skill-card)"
    icon-border-color="var(--other-border-skill-card)"
    icon-bottom="-3rem"
  />
</template>

<script lang="ts" setup>
import type { TraceViewDTO } from '@/api/avenir-esr'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import CompactCard from '@/features/student/global/components/cards/CompactCard/CompactCard.vue'
import { getTraceComplementaryInfo } from '@/features/student/traces/utils/trace.utils'

export interface StudentTraceViewCompactCardProps {
  trace: TraceViewDTO
}

const { trace } = defineProps<StudentTraceViewCompactCardProps>()

const complementaryInfo = computed(() => getTraceComplementaryInfo(trace))
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
  >
    <span
      v-if="complementaryInfo"
      class="caption-light"
      data-testid="trace-view-compact-card-info"
    >{{ complementaryInfo }}</span>
  </CompactCard>
</template>

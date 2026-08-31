<script lang="ts" setup>
import type { TraceOverviewDTO } from '@/api/avenir-esr'
import LongIconCard from '@/common/components/cards/LongIconCard/LongIconCard.vue'
import { ICONS, ROUTES } from '@/common/constants'
import TraceAiProducedBadge from '@/features/traces/components/badges/TraceAiProducedBadge/TraceAiProducedBadge.vue'
import TraceAuthorTypeBadge from '@/features/traces/components/badges/TraceAuthorTypeBadge/TraceAuthorTypeBadge.vue'

export interface TraceLongIconCardProps {
  trace: TraceOverviewDTO
}

defineProps<TraceLongIconCardProps>()
</script>

<template>
  <LongIconCard
    :title="trace.title"
    :icon="{ name: ICONS.TRACES, color: 'var(--text1)' }"
    icon-background-color="var(--light-background-neutral)"
    :to="{ name: ROUTES.STUDENT.TRACE.name, params: { id: trace.id } }"
    data-testid="trace-long-icon-card"
  >
    <div class="av-row av-gap-sm">
      <TraceAuthorTypeBadge :author-type="trace.authorType" />
      <TraceAiProducedBadge :ai-produced="!!trace.aiUseJustification" />
    </div>
  </LongIconCard>
</template>

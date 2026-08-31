<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import type { FeedbackAssociatedElement } from '@/features/feedbacks/types/feedback.types'
import { EAssociationContextType } from '@/api/avenir-esr'
import AssociatedElementTypeBadge from '@/features/feedbacks/views/FeedbacksView/components/badges/AssociatedElementTypeBadge/AssociatedElementTypeBadge.vue'
import FeedbackTraceActions from '@/features/feedbacks/views/FeedbacksView/components/FeedbackTraceActions/FeedbackTraceActions.vue'
import { AvCard } from '@avenirs-esr/avenirs-dsav'

export interface AssociatedElementCardProps {
  feedbackAssociatedElement: FeedbackAssociatedElement
}

const { feedbackAssociatedElement } = defineProps<AssociatedElementCardProps>()

const traceData = computed(() =>
  feedbackAssociatedElement.type === EAssociationContextType.TRACE
    ? (feedbackAssociatedElement.data as TraceDetailDTO)
    : null
)
const title = computed(() => feedbackAssociatedElement.data.title)
</script>

<template>
  <AvCard
    collapsible
    :collapsed="true"
    data-testid="associated-element-card"
    :data-element-id="feedbackAssociatedElement.data.id"
  >
    <template #title="{ collapsed }">
      <div class="av-row av-align-center av-gap-sm av-flex-fill ellipsis-container">
        <div class="badge-container">
          <AssociatedElementTypeBadge
            :associated-element-type="feedbackAssociatedElement.type"
          />
        </div>
        <span
          class="av-text-text1"
          :class="collapsed ? 'ellipsis' : ''"
        >
          {{ title }}
        </span>
      </div>
      <div class="av-row av-align-center av-gap-sm">
        <FeedbackTraceActions
          v-if="traceData"
          :trace="traceData"
        />
      </div>
    </template>

    <slot />
  </AvCard>
</template>

<style scoped lang="scss">
  .badge-container {
    width: var(--dimension-6xl);
    flex-shrink: 0;
  }
</style>

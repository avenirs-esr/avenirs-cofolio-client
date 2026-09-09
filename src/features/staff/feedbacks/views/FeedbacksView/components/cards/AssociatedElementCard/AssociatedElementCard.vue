<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import type { FeedbackAssociatedElement } from '@/features/staff/feedbacks/types/feedback.types'
import { EAssociationContextType } from '@/api/avenir-esr'
import AssociatedElementTypeBadge from '@/features/staff/feedbacks/views/FeedbacksView/components/badges/AssociatedElementTypeBadge/AssociatedElementTypeBadge.vue'
import FeedbackTraceActions from '@/features/staff/feedbacks/views/FeedbacksView/components/FeedbackTraceActions/FeedbackTraceActions.vue'
import { AvButton, AvCard, CUIDA_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociatedElementCardProps {
  feedbackAssociatedElement: FeedbackAssociatedElement
  showDetailsButton?: boolean
}

const { feedbackAssociatedElement, showDetailsButton = true } = defineProps<AssociatedElementCardProps>()

const emit = defineEmits<{
  (event: 'showDetails', element: FeedbackAssociatedElement): void
}>()

const { t } = useI18n()

const traceData = computed(() =>
  feedbackAssociatedElement.type === EAssociationContextType.TRACE
    ? (feedbackAssociatedElement.data as TraceDetailDTO)
    : null
)
const title = computed(() => feedbackAssociatedElement.data.title)

function handleShowDetails () {
  emit('showDetails', feedbackAssociatedElement)
}
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
        <AvButton
          v-if="showDetailsButton"
          :icon="CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
          :label="t('global.buttons.showDetails')"
          :aria-label="t('global.buttons.showDetails')"
          icon-only
          data-testid="associated-element-show-details"
          @click="handleShowDetails"
        />
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

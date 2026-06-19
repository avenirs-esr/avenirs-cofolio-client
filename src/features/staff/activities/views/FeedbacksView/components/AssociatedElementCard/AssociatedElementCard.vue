<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import type { FeedbackAssociatedElement } from '@/features/staff/activities/types/feedback.types'
import { EAssociationContextType } from '@/api/avenir-esr'
import { useNavigation } from '@/common/composables'
import AssociatedElementTypeBadge from '@/features/staff/activities/components/badges/AssociatedElementTypeBadge/AssociatedElementTypeBadge.vue'
import FeedbackTraceActions from '@/features/staff/activities/views/FeedbacksView/components/FeedbackTraceActions/FeedbackTraceActions.vue'
import { AvButton, AvCard, CUIDA_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociatedElementCardProps {
  feedbackAssociatedElement: FeedbackAssociatedElement
}

const { feedbackAssociatedElement } = defineProps<AssociatedElementCardProps>()

const { t } = useI18n()
const { navigateToStudentToolsTrace, navigateToStudentProjectSkill } = useNavigation()

const traceData = computed(() =>
  feedbackAssociatedElement.type === EAssociationContextType.TRACE
    ? (feedbackAssociatedElement.data as TraceDetailDTO)
    : null
)
const title = computed(() => feedbackAssociatedElement.data.title)

function openDetail () {
  switch (feedbackAssociatedElement.type) {
    case EAssociationContextType.TRACE:
      navigateToStudentToolsTrace({ id: feedbackAssociatedElement.data.id })
      break
    case EAssociationContextType.DECLARED_SKILL:
      navigateToStudentProjectSkill({ id: feedbackAssociatedElement.data.id })
      break
  }
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
        <FeedbackTraceActions
          v-if="traceData"
          :trace="traceData"
        />
        <AvButton
          :icon="CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
          :label="t('global.detail')"
          data-testid="associated-element-card-detail-button"
          @click.stop="openDetail"
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

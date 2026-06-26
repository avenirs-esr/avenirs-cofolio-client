<script lang="ts" setup>
import type { FeedbackOverviewDTO } from '@/api/avenir-esr'
import Card from '@/common/components/cards/Card/Card.vue'
import { ROUTES } from '@/common/constants'
import { formatDateToShortDate } from '@/common/utils'
import FeedbackIterationBadge from '@/features/staff/feedbacks/components/badges/FeedbackIterationBadge/FeedbackIterationBadge.vue'
import { AvButton, CUIDA_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbackHistoryCardProps {
  feedback: FeedbackOverviewDTO
  iteration: number
  maxIterations?: number
  collapsed?: boolean
}

const { feedback, iteration, maxIterations, collapsed = true } = defineProps<FeedbackHistoryCardProps>()

const { t } = useI18n()

const createdAtFormatted = computed(() => formatDateToShortDate(feedback.createdAt))
const updatedAtFormatted = computed(() => formatDateToShortDate(feedback.updatedAt))
</script>

<template>
  <Card
    collapsible
    :collapsed="collapsed"
    class="feedback-history-card"
    data-testid="feedback-history-card"
    :data-feedback-id="feedback.id"
  >
    <template #title="{ collapsed: isCollapsed }">
      <div class="av-col av-gap-xs">
        <div class="av-row av-align-center av-gap-sm">
          <FeedbackIterationBadge
            :iteration="iteration"
            :max-iterations="maxIterations"
            :color="isCollapsed ? undefined : 'var(--surface-background)'"
            :background-color="isCollapsed ? undefined : 'var(--dark-background-primary1)'"
            data-testid="feedback-history-card-badge"
          />
          <span
            class="b2-regular"
            :class="[isCollapsed ? 'av-text-text1' : 'b1-bold av-text-primary1']"
            data-testid="feedback-history-card-date"
          >
            {{ createdAtFormatted }}
          </span>
        </div>
        <span
          class="av-text-text2"
          data-testid="feedback-history-card-author"
        >
          {{ t("staff.feedbacks.cards.FeedbackHistoryCard.writtenBy", { date: updatedAtFormatted }) }}
        </span>
      </div>
    </template>

    <template #body>
      <div class="av-col av-gap-sm">
        <span
          v-if="feedback.feedback"
          class="b2-light av-text-text1"
          data-testid="feedback-history-card-content"
        >
          {{ feedback.feedback }}
        </span>
        <div class="av-row av-justify-end">
          <AvButton
            theme="PRIMARY"
            variant="DEFAULT"
            :icon="CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
            :label="t('staff.feedbacks.cards.FeedbackHistoryCard.seeDetail', { date: createdAtFormatted })"
            data-testid="feedback-history-card-detail-link"
            :to="{
              name: ROUTES.STAFF.ACTIVITY_FEEDBACK_DETAILS.name,
              params: { feedbackId: feedback.id },
            }"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.feedback-history-card :deep([data-collapsed="false"]) {
  border-color: var(--dark-background-primary1) !important;
}
</style>

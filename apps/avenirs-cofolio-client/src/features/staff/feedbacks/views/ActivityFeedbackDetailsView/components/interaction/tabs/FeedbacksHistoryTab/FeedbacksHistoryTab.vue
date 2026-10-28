<script lang="ts" setup>
import type { BaseApiException } from '@avenirs-esr/shared'
import type { FeedbackOverviewDTO } from '@/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import FeedbackHistoryCard from '@/features/staff/feedbacks/components/cards/FeedbackHistoryCard/FeedbackHistoryCard.vue'

export interface FeedbacksHistoryTabProps {
  feedbacks: FeedbackOverviewDTO[]
  maxIterations?: number
  isLoading?: boolean
  error?: BaseApiException | null
}

const {
  feedbacks,
  maxIterations,
  isLoading = false,
  error = null,
} = defineProps<FeedbacksHistoryTabProps>()

const { t } = useI18n()
</script>

<template>
  <QuerySuspense
    :is-loading="isLoading"
    :error="error"
    :is-empty="feedbacks.length === 0"
    :empty-state-message="t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.history.emptyState')"
    data-testid="feedbacks-history-tab"
  >
    <div class="av-col av-gap-sm">
      <FeedbackHistoryCard
        v-for="(feedback, index) in feedbacks"
        :key="feedback.id"
        :feedback="feedback"
        :iteration="feedbacks.length - index"
        :max-iterations="maxIterations"
      />
    </div>
  </QuerySuspense>
</template>

<script lang="ts" setup>
import type { FeedbackOverviewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import FeedbackHistoryCard from '@/features/staff/feedbacks/components/cards/FeedbackHistoryCard/FeedbackHistoryCard.vue'
import { useI18n } from 'vue-i18n'

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
    :empty-state-message="t('staff.feedbacks.views.ActivityFeedbackDetailsView.WriteFeedbackFloatingPanel.tabs.history.emptyState')"
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

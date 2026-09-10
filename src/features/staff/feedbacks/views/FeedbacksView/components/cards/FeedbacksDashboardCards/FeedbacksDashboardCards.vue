<script lang="ts" setup>
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import DashboardCard from '@/features/staff/global/components/cards/DashboardCard/DashboardCard.vue'
import { MDI_ICONS, MS_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbacksDashboardCardsProps {
  title?: string
  totalFeedbacks: number
  newFeedbacks: number
  unprocessedFeedbacks: number
  sentFeedbacks: number
}

const {
  title,
  totalFeedbacks,
  newFeedbacks,
  unprocessedFeedbacks,
  sentFeedbacks
} = defineProps<FeedbacksDashboardCardsProps>()

const { t } = useI18n()

const activityTitle = computed(() => title === undefined ? t('staff.feedbacks.views.FeedbacksView.FeedbacksDashboardCards.allActivities') : title)
</script>

<template>
  <IconTitleCardContainer
    :title="t('staff.feedbacks.views.FeedbacksView.FeedbacksDashboardCards.title', { activity: activityTitle })"
    :title-icon="RI_ICONS.DASHBOARD_2_LINE"
    data-testid="feedbacks-dashboard-cards"
  >
    <div class="av-row av-wrap av-w-full av-gap-sm">
      <DashboardCard
        :label="t('staff.feedbacks.views.FeedbacksView.FeedbacksDashboardCards.new', { count: newFeedbacks })"
        :icon="MDI_ICONS.CHAT_ALERT"
        :value="String(newFeedbacks)"
        data-testid="new-feedbacks-dashboard-card"
      />
      <DashboardCard
        :label="t('staff.feedbacks.views.FeedbacksView.FeedbacksDashboardCards.unprocessed', { count: unprocessedFeedbacks })"
        :icon="MS_ICONS.CHAT_OUTLINE_ROUNDED"
        :value="String(unprocessedFeedbacks)"
        data-testid="unprocessed-feedbacks-dashboard-card"
      />
      <DashboardCard
        :label="t('staff.feedbacks.views.FeedbacksView.FeedbacksDashboardCards.processed', { count: sentFeedbacks })"
        :icon="MDI_ICONS.CHECK_CIRCLE"
        :value="`${sentFeedbacks}/${totalFeedbacks}`"
        data-testid="processed-feedbacks-dashboard-card"
      />
    </div>
  </IconTitleCardContainer>
</template>

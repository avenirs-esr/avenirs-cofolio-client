<script lang="ts" setup>
import { useGetFeedbackDashboard } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import DashboardCard from '@/features/staff/global/components/cards/DashboardCard/DashboardCard.vue'
import DashboardSection from '@/features/staff/global/components/sections/DashboardSection/DashboardSection.vue'
import { MDI_ICONS, MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbacksDashboardSectionProps {
  activityId: string
}

const { activityId } = defineProps<FeedbacksDashboardSectionProps>()

const { t } = useI18n()

const { data: feedbackDashboard, isLoading, error } = useGetFeedbackDashboard({ activityId }, {
  query: {
    enabled: computed(() => !!activityId),
  },
})
</script>

<template>
  <DashboardSection
    :title="t('staff.feedbacks.views.ActivityFeedbacksView.FeedbacksDashboardSection.title')"
    :is-loading="isLoading"
    :error="error"
    data-testid="feedbacks-dashboard-section"
  >
    <DashboardCard
      :label="t('staff.feedbacks.views.ActivityFeedbacksView.FeedbacksDashboardSection.new', { count: feedbackDashboard?.newFeedbacks ?? 0 })"
      :icon="MS_ICONS.FEEDBACK"
      :value="`${feedbackDashboard?.newFeedbacks ?? 0}`"
      data-testid="new-feedbacks-dashboard-card"
    />
    <DashboardCard
      :label="t('staff.feedbacks.views.ActivityFeedbacksView.FeedbacksDashboardSection.pending', { count: feedbackDashboard?.pendingFeedbacks ?? 0 })"
      :icon="ICONS.FEEDBACK"
      :value="`${feedbackDashboard?.pendingFeedbacks ?? 0}`"
      data-testid="pending-feedbacks-dashboard-card"
    />
    <DashboardCard
      :label="t('staff.feedbacks.views.ActivityFeedbacksView.FeedbacksDashboardSection.sent', { count: feedbackDashboard?.processedFeedbacks ?? 0 })"
      :icon="MDI_ICONS.CHECK_CIRCLE"
      :value="`${feedbackDashboard?.processedFeedbacks ?? 0}/${feedbackDashboard?.totalFeedbacks ?? 0}`"
      data-testid="processed-feedbacks-dashboard-card"
    />
  </DashboardSection>
</template>

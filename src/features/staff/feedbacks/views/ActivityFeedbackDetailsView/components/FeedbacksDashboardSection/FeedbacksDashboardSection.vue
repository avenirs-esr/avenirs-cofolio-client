<script lang="ts" setup>
import { useGetFeedbackDashboard } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import DashboardCard from '@/features/staff/global/components/cards/DashboardCard/DashboardCard.vue'
import IconTitleCardContainer from '@/features/staff/global/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import { MDI_ICONS, MS_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DashboardSectionProps {
  activityId: string
}

const { activityId } = defineProps<DashboardSectionProps>()

const { t } = useI18n()

const { data: feedbackDashboard, isLoading, error } = useGetFeedbackDashboard({ activityId }, {
  query: {
    enabled: computed(() => !!activityId),
  },
})
</script>

<template>
  <IconTitleCardContainer
    :title-icon="RI_ICONS.DASHBOARD_2_LINE"
    :title="t('staff.feedbacks.views.ActivityFeedbacksView.FeedbacksDashboardSection.title')"
    data-testid="feedbacks-dashboard-section"
  >
    <QuerySuspense
      :is-loading="isLoading"
      :error="error"
    >
      <div class="av-row av-wrap av-w-full av-gap-sm">
        <DashboardCard
          :label="t('staff.feedbacks.views.ActivityFeedbacksView.FeedbacksDashboardSection.new', { count: feedbackDashboard?.newFeedbacks ?? 0 })"
          :icon="MS_ICONS.FEEDBACK"
          :value="`${feedbackDashboard?.newFeedbacks ?? 0}`"
          data-testid="new-feedbacks-dashboard-card"
        />
        <DashboardCard
          :label="t('staff.feedbacks.views.ActivityFeedbacksView.FeedbacksDashboardSection.sent', { count: feedbackDashboard?.processedFeedbacks ?? 0 })"
          :icon="MDI_ICONS.CHECK_CIRCLE"
          :value="`${feedbackDashboard?.processedFeedbacks ?? 0}/${feedbackDashboard?.totalFeedbacks ?? 0}`"
          data-testid="processed-feedbacks-dashboard-card"
        />
      </div>
    </QuerySuspense>
  </IconTitleCardContainer>
</template>

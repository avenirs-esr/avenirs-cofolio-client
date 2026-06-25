<script lang="ts" setup>
import { EActivityStatus, useGetActivityContent } from '@/api/avenir-esr'
import { QuerySuspense } from '@/common/components'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ICONS, ROUTES } from '@/common/constants'
import FeedbacksDashboardSection from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/FeedbacksDashboardSection/FeedbacksDashboardSection.vue'
import ActivityFeedbacksCard
  from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/ActivityFeedbacksCard/ActivityFeedbacksCard.vue'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { activityId } = defineProps<ActivityFeedbacksViewProps>()

export interface ActivityFeedbacksViewProps {
  activityId: string
}

const { t } = useI18n()

const { data: activity, isLoading, error } = useGetActivityContent(EActivityStatus.PUBLISHED, activityId)

const activityTitle = computed(() => activity.value?.title ?? '')

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.activities.header'), to: ROUTES.STAFF.ACTIVITIES },
  { text: activityTitle.value },
  { text: t('staff.global.navigation.tabs.studentFeedbacks') },
])
</script>

<template>
  <PageTitle
    :breadcrumb-links="breadcrumbLinks"
    :title="t('staff.feedbacks.views.ActivityFeedbacksView.title', { activityTitle })"
  />
  <div class="av-col av-gap-md">
    <div class="av-col av-gap-xs">
      <AvIconText
        :icon="ICONS.ACTIVITY"
        :text="t('staff.feedbacks.views.ActivityFeedbacksView.ActivityFeedbacksCard.title')"
        typography-class="n4"
        text-color="var(--dark-background-primary1)"
        icon-color="var(--icon)"
      />
      <span
        class="n5 av-pl-2xl av-text-primary1 av-text-regular"
      >{{ activity?.title }}</span>
    </div>
    <FeedbacksDashboardSection :activity-id="activityId" />
    <QuerySuspense
      :is-loading="isLoading"
      :error="error"
      :error-title="t('staff.feedbacks.views.ActivityFeedbacksView.errors.fetchActivity')"
    >
      <ActivityFeedbacksCard
        :activity="activity!"
      />
    </QuerySuspense>
  </div>
</template>

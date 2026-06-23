<script lang="ts" setup>
import { EActivityStatus, useGetActivityContent } from '@/api/avenir-esr'
import { QuerySuspense } from '@/common/components'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { ROUTES } from '@/common/constants'
import ActivityFeedbacksDashboard from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/ActivityFeedbacksDashboard/ActivityFeedbacksDashboard.vue'
import WriteFeedbackFloatingPanel from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/overlays/WriteFeedbackFloatingPanel/WriteFeedbackFloatingPanel.vue'
import { useRouteQuery } from '@vueuse/router'
import { useI18n } from 'vue-i18n'

const { activityId } = defineProps<ActivityFeedbacksViewProps>()

enum ActivityFeedbacksViewSection {
  DASHBOARD = 'DASHBOARD',
  ALL_FEEDBACKS = 'ALL_FEEDBACKS',
}

export interface ActivityFeedbacksViewProps {
  activityId: string
}

const { t } = useI18n()

const activeSection = useEnumRouteQuery('section', ActivityFeedbacksViewSection, ActivityFeedbacksViewSection.DASHBOARD)

const feedbackId = useRouteQuery<string | null>('feedbackId', null)

const { data: activity, isLoading, error } = useGetActivityContent(EActivityStatus.PUBLISHED, activityId)

const activityTitle = computed(() => activity.value?.title ?? '')
const feedbacksCount = ref(0)

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.studentTracking') },
  { text: t('staff.global.navigation.tabs.studentFeedbacks'), to: ROUTES.STAFF.STUDENT_FEEDBACKS },
  { text: activityTitle.value },
])
</script>

<template>
  <PageTitle
    :breadcrumb-links="breadcrumbLinks"
    :title="t('staff.feedbacks.views.ActivityFeedbacksView.title', { count: feedbacksCount, activityTitle })"
  />
  <QuerySuspense
    :is-loading="isLoading"
    :error="error"
    :error-title="t('staff.feedbacks.views.ActivityFeedbacksView.errors.fetchActivity')"
  >
    <ActivityFeedbacksDashboard
      v-if="activeSection === ActivityFeedbacksViewSection.DASHBOARD"
      :activity="activity!"
      @update-feedbacks-count="feedbacksCount = $event"
    />
  </QuerySuspense>

  <WriteFeedbackFloatingPanel
    v-if="feedbackId"
    :activity-title="activityTitle"
  />
</template>

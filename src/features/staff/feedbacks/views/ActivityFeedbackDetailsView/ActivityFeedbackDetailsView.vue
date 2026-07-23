<script lang="ts" setup>
import type { AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import {
  EUserCategory,
  useGetFeedbackDetails,
  useGetFeedbacksByActivity,
} from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { ROUTES } from '@/common/constants'
import StudentPerspectiveCard from '@/features/staff/feedbacks/components/cards/StudentPerspectiveCard/StudentPerspectiveCard.vue'
import FeedbackManagementFloatingPanel
  from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/overlays/FeedbackManagementFloatingPanel/FeedbackManagementFloatingPanel.vue'
import ActivityFeedbackStudentSelect
  from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/selects/ActivityFeedbackStudentSelect/ActivityFeedbackStudentSelect.vue'
import AssociatedElementSummaryCard
  from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/AssociatedElementSummaryCard/AssociatedElementSummaryCard.vue'
import { useI18n } from 'vue-i18n'

export interface ActivityFeedbackDetailsViewProps {
  feedbackId?: string
}

const { feedbackId } = defineProps<ActivityFeedbackDetailsViewProps>()

const { t } = useI18n()
const route = useRoute()

const selectedStudent = ref<AvSelectSelectedOption>({
  itemId: feedbackId ?? '',
})

const selectedFeedbackId = computed(() => selectedStudent.value.itemId)

const { data: feedback, isLoading: isFeedbackDetailsLoading, error: feedbackDetailsError, } = useGetFeedbackDetails(
  EUserCategory.STAFF,
  selectedFeedbackId,
  {
    query: {
      enabled: computed(() => !!selectedFeedbackId.value),
    },
  },
)

const activityId = computed(() => feedback.value?.activity.id ?? '')

const { data: feedbacksByActivity, isLoading: isFeedbacksByActivityLoading, error: feedbacksByActivityError, } = useGetFeedbacksByActivity(
  activityId,
  {
    query: {
      enabled: computed(() => !!activityId.value),
    },
  },
)

const feedbacks = computed(() => Array.isArray(feedbacksByActivity.value) ? feedbacksByActivity.value : [])

const feedbacksCount = computed(() => feedbacks.value.length)

const activityTitle = computed(() => feedback.value?.activity.title ?? '')
const studentPerspective = computed(() =>
  feedback.value?.reflexion ?? ''
)

const isStudentTrackingRoute = computed(() => route.name === ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name)

const homeBreadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.studentFeedbacks') },
  { text: activityTitle.value },
])

const studentTrackingBreadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.studentTracking') },
  { text: t('staff.global.navigation.tabs.studentFeedbacks'), to: ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS },
  { text: activityTitle.value },
])

const breadcrumbLinks = computed(() => isStudentTrackingRoute.value
  ? studentTrackingBreadcrumbLinks.value
  : homeBreadcrumbLinks.value)

const pageTitle = computed(() =>
  t('staff.feedbacks.views.ActivityFeedbackDetailsView.title', {
    count: feedbacksCount.value,
    activityTitle: activityTitle.value,
  }),
)
</script>

<template>
  <PageTitle
    :breadcrumb-links="breadcrumbLinks"
    :title="pageTitle"
  />

  <div class="av-col av-gap-lg">
    <QuerySuspense
      :is-loading="isFeedbacksByActivityLoading"
      :error="feedbacksByActivityError"
    >
      <ActivityFeedbackStudentSelect
        v-model:selected-student="selectedStudent"
        :feedbacks="feedbacks"
      />
    </QuerySuspense>

    <QuerySuspense
      :is-loading="isFeedbackDetailsLoading"
      :error="feedbackDetailsError"
    >
      <StudentPerspectiveCard
        v-if="feedback"
        :perspective="studentPerspective"
      />
    </QuerySuspense>

    <AssociatedElementSummaryCard
      v-if="selectedFeedbackId"
      :feedback-id="selectedFeedbackId"
    />
  </div>

  <FeedbackManagementFloatingPanel
    v-if="feedback"
    :feedback="feedback"
    :activity-title="activityTitle"
  />
</template>

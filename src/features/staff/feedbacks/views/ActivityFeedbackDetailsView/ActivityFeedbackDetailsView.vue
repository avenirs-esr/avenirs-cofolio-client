<script lang="ts" setup>
import {
  EActivityStatus,
  EUserCategory,
  useGetFeedbackDetails,
  useGetFeedbacksByActivity,
} from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { ICONS, ROUTES } from '@/common/constants'
import StudentPerspectiveCard from '@/features/staff/feedbacks/components/cards/StudentPerspectiveCard/StudentPerspectiveCard.vue'
import FeedbackManagementFloatingPanel
  from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/overlays/FeedbackManagementFloatingPanel/FeedbackManagementFloatingPanel.vue'
import ActivityFeedbackStudentSelect
  from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/selects/ActivityFeedbackStudentSelect/ActivityFeedbackStudentSelect.vue'
import AssociatedElementSummaryCard
  from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/AssociatedElementSummaryCard/AssociatedElementSummaryCard.vue'
import { AvButton, AvIconText, type AvSelectSelectedOption, CUIDA_ICONS } from '@avenirs-esr/avenirs-dsav'
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

const activityTitle = computed(() => feedback.value?.activity.title ?? '')
const studentPerspective = computed(() =>
  feedback.value?.reflexion ?? ''
)

const isStudentTrackingRoute = computed(() => route.name === ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name)

const pageSubTitle = computed(() => `${t('global.activities.activity')} "${activityTitle.value}"`)

const homeBreadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.studentFeedbacks') },
  { text: pageSubTitle.value },
])

const studentTrackingBreadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.studentTracking') },
  { text: t('staff.global.navigation.tabs.studentFeedbacks'), to: ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS },
  { text: pageSubTitle.value },
])

const breadcrumbLinks = computed(() => isStudentTrackingRoute.value
  ? studentTrackingBreadcrumbLinks.value
  : homeBreadcrumbLinks.value)
</script>

<template>
  <PageTitle
    :breadcrumb-links="breadcrumbLinks"
    :title="t('staff.feedbacks.views.ActivityFeedbackDetailsView.title')"
  />

  <div class="av-col av-gap-lg">
    <div class="av-col av-gap-sm av-py-sm page-sub-title">
      <QuerySuspense
        :is-loading="isFeedbackDetailsLoading"
        :error="feedbackDetailsError"
      >
        <div class="av-row av-justify-between av-align-center av-gap-sm av-wrap">
          <AvIconText
            :icon="ICONS.ACTIVITY"
            icon-color="var(--icon)"
            :text="pageSubTitle"
            text-color="var(--dark-background-primary1)"
            typography-class="n5"
            gap="var(--spacing-xs)"
            data-testid="page-sub-title"
          />
          <AvButton
            :label="t('staff.feedbacks.views.ActivityFeedbackDetailsView.seeActivity')"
            :icon="CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
            :to="{ name: ROUTES.STAFF.ACTIVITY_CATALOG.name, params: { status: EActivityStatus.PUBLISHED, id: activityId ?? '' } }"
            small
            data-testid="see-activity"
          />
        </div>
      </QuerySuspense>
      <QuerySuspense
        :is-loading="isFeedbacksByActivityLoading"
        :error="feedbacksByActivityError"
      >
        <ActivityFeedbackStudentSelect
          v-model:selected-student="selectedStudent"
          :feedbacks="feedbacks"
        />
      </QuerySuspense>
    </div>

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

<style scoped lang="scss">
.page-sub-title {
  border-top: 1px solid var(--stroke);
  border-bottom: 1px solid var(--stroke);
}
</style>

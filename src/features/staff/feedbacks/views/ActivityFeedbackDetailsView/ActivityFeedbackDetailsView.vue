<script lang="ts" setup>
import type { AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import {
  EUserCategory,
  useGetDeclaredActivityDetails,
  useGetFeedbackDetails,
  useGetFeedbacksByActivity,
} from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import WriteFeedbackFloatingPanel
  from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/overlays/WriteFeedbackFloatingPanel/WriteFeedbackFloatingPanel.vue'
import ActivityFeedbackStudentSelect
  from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/selects/ActivityFeedbackStudentSelect/ActivityFeedbackStudentSelect.vue'
import { useI18n } from 'vue-i18n'

export interface ActivityFeedbackDetailsViewProps {
  feedbackId?: string
}

const { feedbackId } = defineProps<ActivityFeedbackDetailsViewProps>()

const { t } = useI18n()

const selectedStudent = ref<AvSelectSelectedOption>({
  itemId: feedbackId ?? '',
})

const selectedFeedbackId = computed(() => selectedStudent.value.itemId)

const { data: feedback } = useGetFeedbackDetails(
  EUserCategory.STAFF,
  selectedFeedbackId,
  {
    query: {
      enabled: computed(() => !!selectedFeedbackId.value),
    },
  },
)

const activityDetailsId = computed(() => feedback.value?.declaredActivityId ?? '')

const { data: activity } = useGetDeclaredActivityDetails(
  activityDetailsId,
  {
    query: {
      enabled: computed(() => !!activityDetailsId.value),
    },
  },
)

const activityId = computed(() => activity.value?.activity.id ?? '')

const { data: feedbacksByActivity } = useGetFeedbacksByActivity(
  activityId,
  {
    query: {
      enabled: computed(() => !!activityId.value),
    },
  },
)

const feedbacks = computed(() => Array.isArray(feedbacksByActivity.value) ? feedbacksByActivity.value : [])

const feedbacksCount = computed(() => feedbacks.value.length)

const activityTitle = computed(() => activity.value?.activity.title ?? '')

const showWriteFeedbackPanel = computed(() => !!feedback.value) // TODO

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.studentTracking') },
  { text: t('staff.global.navigation.tabs.studentFeedbacks'), to: ROUTES.STAFF.STUDENT_FEEDBACKS },
  { text: activityTitle.value },
])

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

  <ActivityFeedbackStudentSelect
    v-model:selected-student="selectedStudent"
    :feedbacks="feedbacks"
  />

  <WriteFeedbackFloatingPanel
    v-if="showWriteFeedbackPanel && feedback"
    :feedback="feedback"
    :activity-title="activityTitle"
  />
</template>

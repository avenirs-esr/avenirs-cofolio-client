<script lang="ts" setup>
import { EUserCategory, useGetDeclaredActivityDetails, useGetFeedbackDetails } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import WriteFeedbackFloatingPanel from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/overlays/WriteFeedbackFloatingPanel/WriteFeedbackFloatingPanel.vue'
import { useI18n } from 'vue-i18n'

export interface ActivityFeedbackDetailsViewProps {
  feedbackId?: string
}

const { feedbackId } = defineProps<ActivityFeedbackDetailsViewProps>()

const { t } = useI18n()

const { data: feedback } = useGetFeedbackDetails(EUserCategory.STAFF, feedbackId ?? '', {
  query: { enabled: !!feedbackId },
})

const activityDetailsId = computed(() => feedback.value?.declaredActivityId ?? '')

const { data: activity } = useGetDeclaredActivityDetails(activityDetailsId, {
  query: { enabled: computed(() => !!activityDetailsId.value) },
})

const feedbacksCount = ref(0) // TODO: fetch feedbacks count using activityId prop

const showWriteFeedbackPanel = ref(true) // TODO

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.studentTracking') },
  { text: t('staff.global.navigation.tabs.studentFeedbacks'), to: ROUTES.STAFF.STUDENT_FEEDBACKS },
  { text: activity.value?.activity.title ?? '' },
])
</script>

<template>
  <PageTitle
    :breadcrumb-links="breadcrumbLinks"
    :title="t('staff.feedbacks.views.ActivityFeedbackDetailsView.title', { count: feedbacksCount, activityTitle: activity?.activity.title ?? '' })"
  />

  <WriteFeedbackFloatingPanel
    v-if="showWriteFeedbackPanel && feedback"
    :feedback="feedback"
    :activity-title="activity?.activity.title ?? ''"
  />
</template>

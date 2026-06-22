<script lang="ts" setup>
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import WriteFeedbackFloatingPanel from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/overlays/WriteFeedbackFloatingPanel/WriteFeedbackFloatingPanel.vue'
import { useI18n } from 'vue-i18n'

export interface ActivityFeedbacksViewProps {
  activityId: string
  feedbackId?: string
}

defineProps<ActivityFeedbacksViewProps>()

const { t } = useI18n()

const activityTitle = ref('Activity placeholder') // TODO: fetch activity title using activityId prop
const feedbacksCount = ref(0) // TODO: fetch feedbacks count using activityId prop

const showWriteFeedbackPanel = ref(true) // TODO

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

  <WriteFeedbackFloatingPanel
    v-if="showWriteFeedbackPanel"
    :activity-title="activityTitle"
  />
</template>

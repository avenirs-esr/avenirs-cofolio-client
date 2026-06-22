<script setup lang="ts">
import { EActivityStatus, useGetActivityContent } from '@/api/avenir-esr'
import { QuerySuspense } from '@/common/components'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import ActivityFeedbacksDashboard from '@/features/staff/activities/views/ActivityFeedbacksView/components/ActivityFeedbacksDashboard/ActivityFeedbacksDashboard.vue'
import { useI18n } from 'vue-i18n'

interface Props { id: string }
const { id } = defineProps<Props>()

const { t } = useI18n()
const { data: activity, isLoading, error } = useGetActivityContent(EActivityStatus.PUBLISHED, id)

const activityTitle = computed(() => activity.value?.title ?? '')
const pageTitle = computed(() => t('staff.activities.views.ActivityFeedbacksView.title', { name: activityTitle.value }))

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.activities.header'), to: ROUTES.STAFF.ACTIVITIES },
  { text: activityTitle.value },
])
</script>

<template>
  <PageTitle
    :title="pageTitle"
    :breadcrumb-links="breadcrumbLinks"
  />
  <QuerySuspense
    :is-loading="isLoading"
    :error="error"
    :error-title="t('staff.activities.views.ActivityFeedbacksView.errors.fetchActivity')"
  >
    <ActivityFeedbacksDashboard />
  </QuerySuspense>
</template>

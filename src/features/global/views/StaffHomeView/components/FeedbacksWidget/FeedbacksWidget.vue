<script setup lang="ts">
import { useGetStaffFeedbacks } from '@/api/avenir-esr'
import HomeWidget from '@/common/components/cards/HomeWidget/HomeWidget.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ROUTES } from '@/common/constants'
import FeedbackLongIconCard from '@/features/global/views/StaffHomeView/components/FeedbackLongIconCard/FeedbackLongIconCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()

const params = computed(() => ({
  page: 0,
  pageSize: 3,
}))

const {
  data,
  error,
  isLoading,
  isFetching
} = useGetStaffFeedbacks(params)
const feedbacks = computed(() => data.value?.data || [])
</script>

<template>
  <HomeWidget
    :title="t('staff.global.views.StaffHomeView.widgets.FeedbacksWidget.title')"
    :title-icon="MDI_ICONS.ATTACH_FILE"
    :see-all-label="t('staff.global.views.StaffHomeView.widgets.FeedbacksWidget.seeAll')"
    type="main"
    :to="ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS"
    data-testid="feedbacks-widget"
  >
    <QuerySuspense
      :is-loading="isLoading || isFetching"
      :is-empty="feedbacks.length === 0"
      :error="error"
      :error-title="t('staff.global.views.StaffHomeView.widgets.FeedbacksWidget.error')"
      :error-description="getErrorMessage(error)"
      :empty-state-message="t('staff.global.views.StaffHomeView.widgets.FeedbacksWidget.emptyState')"
    >
      <div class="av-col av-gap-md">
        <FeedbackLongIconCard
          v-for="feedback in feedbacks"
          :key="feedback.id"
          :feedback="feedback"
        />
      </div>
    </QuerySuspense>
  </HomeWidget>
</template>

<script setup lang="ts">
import { type ActivityItemNavigationDTO, useGetStaffFeedbacks } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { useFeedbackStatusPicker } from '@/features/staff/feedbacks/components/interaction/pickers/FeedbackStatusPicker/composables/use-feedback-status-picker/use-feedback-status-picker'
import FeedbackStatusPicker from '@/features/staff/feedbacks/components/interaction/pickers/FeedbackStatusPicker/FeedbackStatusPicker.vue'
import { useStaffFeedbacksStore } from '@/features/staff/feedbacks/stores/feedbacks.store'
import FeedbacksDashboardCards from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbacksDashboardCards/FeedbacksDashboardCards.vue'
import FeedbacksFiltersCard from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbacksFilterdCard/FeedbacksFiltersCard.vue'
import FeedbacksTable from '@/features/staff/feedbacks/views/FeedbacksView/components/FeedbacksTable/FeedbacksTable.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.studentTracking') },
  { text: t('staff.global.navigation.tabs.studentFeedbacks') },
])

const staffFeedbacksStore = useStaffFeedbacksStore()

const selectedActivityRef = ref<ActivityItemNavigationDTO | undefined>()
const selectedActivityId = computed(() => selectedActivityRef.value?.id)

const {
  newFeedbacks,
  unprocessedFeedbacks,
  sentFeedbacks,
  totalFeedbacks,
  selectedStatus,
  onStatusSelected
} = useFeedbackStatusPicker({
  activityId: selectedActivityId,
  onReset: () => { staffFeedbacksStore.feedbacksCurrentPage = 0 },
})

const usePaginatedStaffFeedbacksParams = computed(() => ({
  currentPageRef: toRef(staffFeedbacksStore, 'feedbacksCurrentPage'),
  pageSizeRef: toRef(staffFeedbacksStore, 'feedbacksPageSizeSelected'),
  selectedActivityIdRef: selectedActivityId,
  selectedStatusRef: selectedStatus,
  fetchFn: useGetStaffFeedbacks,
}))
</script>

<template>
  <PageTitle
    :title="t('staff.feedbacks.views.FeedbacksView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />

  <div class="av-col av-gap-xl">
    <FeedbacksFiltersCard @selected-activity-change="selectedActivityRef = $event" />

    <FeedbacksDashboardCards
      :activity="selectedActivityRef"
      :total-feedbacks="totalFeedbacks"
      :new-feedbacks="newFeedbacks"
      :unprocessed-feedbacks="unprocessedFeedbacks"
      :sent-feedbacks="sentFeedbacks"
    />

    <FeedbackStatusPicker
      :total-feedbacks="totalFeedbacks"
      :new-feedbacks="newFeedbacks"
      :unprocessed-feedbacks="unprocessedFeedbacks"
      :sent-feedbacks="sentFeedbacks"
      @select="onStatusSelected"
    />

    <FeedbacksTable
      :selected-status="selectedStatus"
      :use-paginated-staff-feedbacks-params="usePaginatedStaffFeedbacksParams"
    />
  </div>
</template>

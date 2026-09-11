<script setup lang="ts">
import { type ActivityFeedbacksPreviewDTO, useGetStaffFeedbacks } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useBreadcrumb, useQueryParam } from '@/common/composables'
import { useFeedbackStatusPicker } from '@/features/staff/feedbacks/components/interaction/pickers/FeedbackStatusPicker/composables/use-feedback-status-picker/use-feedback-status-picker'
import FeedbackStatusPicker from '@/features/staff/feedbacks/components/interaction/pickers/FeedbackStatusPicker/FeedbackStatusPicker.vue'
import { useStaffFeedbacksStore } from '@/features/staff/feedbacks/stores/feedbacks.store'
import FeedbackActivityConsignCard from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbackActivityConsignCard/FeedbackActivityConsignCard.vue'
import FeedbacksDashboardCards from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbacksDashboardCards/FeedbacksDashboardCards.vue'
import FeedbacksFiltersCard from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbacksFiltersCard/FeedbacksFiltersCard.vue'
import FeedbacksTable from '@/features/staff/feedbacks/views/FeedbacksView/components/FeedbacksTable/FeedbacksTable.vue'
import { useI18n } from 'vue-i18n'

export interface FeedbacksViewProps {
  activityId?: string
}

const { activityId } = defineProps<FeedbacksViewProps>()

const { t } = useI18n()
const { setQueryParamValue } = useQueryParam()

const { breadcrumbLinks } = useBreadcrumb()

const staffFeedbacksStore = useStaffFeedbacksStore()

const selectedActivity = ref<ActivityFeedbacksPreviewDTO | undefined>()
const selectedActivityId = computed(() => selectedActivity.value?.id)

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

function handleSelectedActivity (activity?: ActivityFeedbacksPreviewDTO) {
  selectedActivity.value = activity
  setQueryParamValue('activityId', activity?.id)
}
</script>

<template>
  <PageTitle
    :title="t('staff.feedbacks.views.FeedbacksView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />

  <div class="av-col av-gap-xl">
    <FeedbacksFiltersCard
      :default-activity-id="activityId"
      @selected-activity-change="handleSelectedActivity"
    />

    <FeedbacksDashboardCards
      :title="selectedActivity?.title"
      :total-feedbacks="totalFeedbacks"
      :new-feedbacks="newFeedbacks"
      :unprocessed-feedbacks="unprocessedFeedbacks"
      :sent-feedbacks="sentFeedbacks"
    />

    <FeedbackActivityConsignCard :description="selectedActivity?.description" />

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

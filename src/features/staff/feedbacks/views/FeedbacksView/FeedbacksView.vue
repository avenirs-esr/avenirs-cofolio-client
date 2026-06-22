<script setup lang="ts">
import type { AvTagPickerOption } from '@avenirs-esr/avenirs-dsav'
import { EFeedbackStatus, useGetStaffFeedbacks } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { useStaffFeedbacksStore } from '@/features/staff/feedbacks/stores/feedbacks.store'
import FeedbacksTable from '@/features/staff/feedbacks/views/FeedbacksView/components/FeedbacksTable/FeedbacksTable.vue'
import FeedbackStatusPicker from '@/features/staff/feedbacks/views/FeedbacksView/components/interaction/pickers/FeedbackStatusPicker/FeedbackStatusPicker.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const totalFeedbacks = ref(0)

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.studentTracking') },
  { text: t('staff.global.navigation.tabs.studentFeedbacks') },
])

const staffFeedbacksStore = useStaffFeedbacksStore()

const usePaginatedStaffFeedbacksParams = {
  currentPageRef: toRef(staffFeedbacksStore, 'feedbacksCurrentPage'),
  pageSizeRef: toRef(staffFeedbacksStore, 'feedbacksPageSizeSelected'),
  fetchFn: useGetStaffFeedbacks,
}

const { data: feedbacksResponse } = useGetStaffFeedbacks({
  page: 0,
  pageSize: 1000,
})

const newFeedbacks = computed(
  () => feedbacksResponse.value?.data?.filter(
    feedback => feedback.status === EFeedbackStatus.NEW,
  ).length ?? 0,
)

const unprocessedFeedbacks = computed(
  () => feedbacksResponse.value?.data?.filter(
    feedback => feedback.status === EFeedbackStatus.IN_PROCESS,
  ).length ?? 0,
)

const sentFeedbacks = computed(
  () => feedbacksResponse.value?.data?.filter(
    feedback => feedback.status === EFeedbackStatus.SUBMITTED,
  ).length ?? 0,
)

const selectedStatus = ref<'ALL' | EFeedbackStatus>('ALL')

function onStatusSelected (option: AvTagPickerOption): void {
  selectedStatus.value = option.value as 'ALL' | EFeedbackStatus
}
</script>

<template>
  <PageTitle
    :title="t('staff.feedbacks.views.FeedbacksView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />

  <div class="av-col av-gap-xl">
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
      @update-feedbacks-count="totalFeedbacks = $event"
    />
  </div>
</template>

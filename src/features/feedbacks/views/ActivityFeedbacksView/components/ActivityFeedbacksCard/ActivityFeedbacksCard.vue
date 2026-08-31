<script setup lang="ts">
import type { ActivityContentDTO } from '@/api/avenir-esr'
import type { UsePaginatedStaffFeedbacksParams } from '@/features/feedbacks/composables/use-paginated-staff-feedbacks/use-paginated-staff-feedbacks'
import type { MaybeRef } from 'vue'
import { useGetStaffFeedbacks } from '@/api/avenir-esr'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import { ICONS } from '@/common/constants'
import { useFeedbackStatusPicker } from '@/features/feedbacks/components/interaction/pickers/FeedbackStatusPicker/composables/use-feedback-status-picker/use-feedback-status-picker'
import FeedbackStatusPicker from '@/features/feedbacks/components/interaction/pickers/FeedbackStatusPicker/FeedbackStatusPicker.vue'
import FeedbacksTable from '@/features/feedbacks/views/FeedbacksView/components/FeedbacksTable/FeedbacksTable.vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { unref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props { activity: ActivityContentDTO }
const { activity } = defineProps<Props>()

const { t } = useI18n()
const currentPage = ref(0)
const pageSizeSelected = ref<PageSizes>(PageSizes.TWELVE)

const { newFeedbacks, unprocessedFeedbacks, sentFeedbacks, totalFeedbacks, selectedStatus, onStatusSelected } = useFeedbackStatusPicker({
  activityId: computed(() => activity.id),
  onReset: () => { currentPage.value = 0 },
})

const usePaginatedStaffFeedbacksParams: UsePaginatedStaffFeedbacksParams = {
  currentPageRef: currentPage,
  pageSizeRef: pageSizeSelected,
  selectedStatusRef: selectedStatus,
  fetchFn: (params: MaybeRef<{ page: number, pageSize: PageSizes }>, options?) =>
    useGetStaffFeedbacks(
      computed(() => ({ ...unref(params), activityId: activity.id })),
      options,
    ),
}
</script>

<template>
  <IconTitleCardContainer
    :title="t('staff.feedbacks.views.ActivityFeedbacksView.ActivityFeedbacksCard.feedbacksSection.title')"
    :title-icon="ICONS.FEEDBACK"
    collapsible
  >
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
      :with-activity="false"
    />
  </IconTitleCardContainer>
</template>

<script setup lang="ts">
import type { ActivityContentDTO } from '@/api/avenir-esr'
import type { UsePaginatedStaffFeedbacksParams } from '@/features/staff/feedbacks/composables/use-paginated-staff-feedbacks/use-paginated-staff-feedbacks'
import type { MaybeRef } from 'vue'
import { useGetStaffFeedbacks } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import FeedbacksTable from '@/features/staff/feedbacks/views/FeedbacksView/components/FeedbacksTable/FeedbacksTable.vue'
import FormFieldCardContainer from '@/features/staff/global/components/cards/FormFieldCardContainer/FormFieldCardContainer.vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { unref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props { activity: ActivityContentDTO }
const { activity } = defineProps<Props>()

const { t } = useI18n()
const currentPage = ref(0)
const pageSizeSelected = ref<PageSizes>(PageSizes.TWENTY)

const usePaginatedStaffFeedbacksParams: UsePaginatedStaffFeedbacksParams = {
  currentPageRef: currentPage,
  pageSizeRef: pageSizeSelected,
  fetchFn: (params: MaybeRef<{ page: number, pageSize: PageSizes }>, options?) =>
    useGetStaffFeedbacks(
      computed(() => ({ ...unref(params), activityId: activity.id })),
      options,
    ),
}
</script>

<template>
  <FormFieldCardContainer
    :title="t('staff.feedbacks.views.ActivityFeedbacksView.ActivityFeedbacksCard.feedbacksSection.title')"
    :title-icon="ICONS.FEEDBACK"
    collapsible
  >
    <FeedbacksTable
      :use-paginated-staff-feedbacks-params="usePaginatedStaffFeedbacksParams"
      :with-activity="false"
    />
  </FormFieldCardContainer>
</template>

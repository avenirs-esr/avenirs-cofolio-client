<script setup lang="ts">
import type { ActivityContentDTO } from '@/api/avenir-esr'
import type { UsePaginatedStaffFeedbacksParams } from '@/features/staff/activities/composables/use-paginated-staff-feedbacks/use-paginated-staff-feedbacks'
import type { PageSizes } from '@avenirs-esr/avenirs-dsav'
import type { MaybeRef } from 'vue'
import { useGetStaffFeedbacks } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import FeedbacksTable from '@/features/staff/activities/views/FeedbacksView/components/FeedbacksTable/FeedbacksTable.vue'
import FormFieldCardContainer from '@/features/staff/global/components/cards/FormFieldCardContainer/FormFieldCardContainer.vue'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'
import { unref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  activity: ActivityContentDTO
}

const { activity } = defineProps<Props>()

const { t } = useI18n()

const currentPage = ref(0)
const pageSizeSelected = ref<PageSizes>(20 as PageSizes)

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
  <div
    class="av-col av-gap-xl"
    data-testid="activity-feedbacks-dashboard"
  >
    <div class="av-col av-gap-xs">
      <AvIconText
        :icon="ICONS.ACTIVITY"
        :text="t('staff.activities.views.ActivityFeedbacksView.ActivityFeedbacksDashboard.title')"
        typography-class="n4"
        text-color="var(--dark-background-primary1)"
        icon-color="var(--icon)"
        data-testid="activity-feedbacks-dashboard-header"
      />
      <span
        class="n5 av-pl-2xl av-text-primary1 av-text-regular"
        data-testid="activity-feedbacks-dashboard-activity-name"
      >{{ activity.title }}</span>
    </div>

    <FormFieldCardContainer
      :title="t('staff.activities.views.ActivityFeedbacksView.ActivityFeedbacksDashboard.feedbacksSection.title')"
      :title-icon="ICONS.FEEDBACK"
      collapsible
      data-testid="activity-feedbacks-dashboard-feedbacks-container"
    >
      <FeedbacksTable :use-paginated-staff-feedbacks-params="usePaginatedStaffFeedbacksParams" />
    </FormFieldCardContainer>
  </div>
</template>

<style scoped lang="scss">
.activity-title {
  font-weight: var(--font-weight-regular);
}
</style>

<script lang="ts" setup>
import type { FeedbackStaffListItemDTO } from '@/api/avenir-esr'
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { Slot } from 'vue'
import Pagination from '@/common/components/Pagination/Pagination.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useDateUtils } from '@/common/composables'
import FeedbackIterationBadge from '@/features/staff/activities/components/badges/FeedbackIterationBadge/FeedbackIterationBadge.vue'
import FeedbackStatusBadge from '@/features/staff/activities/components/badges/FeedbackStatusBadge/FeedbackStatusBadge.vue'
import { usePaginatedStaffFeedbacks, type UsePaginatedStaffFeedbacksParams } from '@/features/staff/activities/composables/use-paginated-staff-feedbacks/use-paginated-staff-feedbacks'
import FeedbackCard from '@/features/staff/activities/views/FeedbackView/components/FeedbackCard/FeedbackCard.vue'
import { AvTable, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbacksTabProps {
  title: string
  emptyStateMessage?: string
  usePaginatedStaffFeedbacksParams: UsePaginatedStaffFeedbacksParams
}

const {
  title,
  emptyStateMessage,
  usePaginatedStaffFeedbacksParams,
} = defineProps<FeedbacksTabProps>()

const emit = defineEmits<{
  (e: 'updateFeedbacksCount', value: number): void
}>()

defineSlots<{
  actions: Slot
}>()

const {
  feedbacks,
  pageInfo,
  isFetching,
  error,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePaginatedStaffFeedbacks(usePaginatedStaffFeedbacksParams)

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()

const { formatLastModified, formatTranslatedDateTime } = useDateUtils()

const rows = computed<FeedbackStaffListItemDTO[]>(() => feedbacks.value)

const columns = computed<AvTableColumn<FeedbackStaffListItemDTO>[]>(() => [
  {
    key: 'student',
    label: t('staff.activities.feedbacks.columns.student'),
  },
  {
    key: 'activity',
    label: t('staff.activities.feedbacks.columns.formation'),
  },
  {
    key: 'createdAt',
    label: t('staff.activities.feedbacks.columns.receivedAt'),
  },
  {
    key: 'status',
    label: t('staff.activities.feedbacks.columns.status'),
  },
  {
    key: 'iteration',
    label: t('staff.activities.feedbacks.columns.iterations'),
  },
  {
    key: 'updatedAt',
    label: t('staff.activities.feedbacks.columns.lastSaved'),
  },
])

watch(
  () => pageInfo?.value?.totalElements,
  (count) => { emit('updateFeedbacksCount', count ?? 0) },
  { immediate: true },
)
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="feedbacks-tab"
  >
    <span
      class="n4"
      data-testid="feedbacks-tab-title"
    >
      {{ title }}
    </span>

    <slot name="actions" />

    <QuerySuspense
      :error="error"
      :is-empty="rows.length === 0"
      :is-loading="isFetching"
      :empty-state-message="emptyStateMessage"
    >
      <Pagination
        v-if="pageInfo"
        :page-info="pageInfo"
        :page-size-selected="pageSizeSelected"
        :on-update-current-page="onUpdateCurrentPage"
        :on-update-page-size="onUpdatePageSize"
      >
        <div
          v-if="isMobile"
          class="av-col av-gap-sm"
        >
          <FeedbackCard
            v-for="feedback in rows"
            :key="feedback.id"
            :feedback="feedback"
          />
        </div>

        <AvTable
          v-else
          :columns="columns"
          :rows="rows"
          row-key="id"
          data-testid="feedbacks-tab-table"
        >
          <template #cell(student)="{ row }">
            {{ row.student?.firstName }} {{ row.student?.lastName }}
          </template>

          <template #cell(activity)="{ row }">
            {{ row.activity?.activity?.title }}
          </template>

          <template #cell(createdAt)="{ row }">
            {{ row.createdAt ? formatLastModified(row.createdAt) : '' }}
          </template>

          <template #cell(status)="{ row }">
            <FeedbackStatusBadge
              :feedback-status="row.status"
            />
          </template>

          <template #cell(iteration)="{ row }">
            <FeedbackIterationBadge
              :iteration="row.iteration ?? 0"
              :max-iterations="row.activity?.activity?.feedbackAllowedIterations"
            />
          </template>

          <template #cell(updatedAt)="{ row }">
            {{ row.updatedAt ? formatTranslatedDateTime(row.updatedAt) : '' }}
          </template>
        </AvTable>
      </Pagination>
    </QuerySuspense>
  </div>
</template>

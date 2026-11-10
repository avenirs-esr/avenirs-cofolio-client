<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { Slot } from 'vue'
import type { FeedbackStaffListItemDTO } from '@/api/avenir-esr'
import type { UsePaginatedStaffFeedbacksParams } from '@/features/staff/feedbacks/composables/use-paginated-staff-feedbacks/use-paginated-staff-feedbacks'
import { AvTable, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { QuerySuspense } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { EFeedbackStatus } from '@/api/avenir-esr'
import Pagination from '@/common/components/navigation/Pagination/Pagination.vue'
import { useDateUtils } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import FeedbackIterationBadge from '@/features/staff/feedbacks/components/badges/FeedbackIterationBadge/FeedbackIterationBadge.vue'
import FeedbackStatusBadge from '@/features/staff/feedbacks/components/badges/FeedbackStatusBadge/FeedbackStatusBadge.vue'
import { usePaginatedStaffFeedbacks } from '@/features/staff/feedbacks/composables/use-paginated-staff-feedbacks/use-paginated-staff-feedbacks'
import FeedbackActivityTitle from '@/features/staff/feedbacks/views/FeedbacksView/components/base/FeedbackActivityTitle/FeedbackActivityTitle.vue'
import FeedbackCard from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbackCard/FeedbackCard.vue'

export interface FeedbacksTableProps {
  emptyStateMessage?: string
  selectedStatus?: 'ALL' | EFeedbackStatus
  usePaginatedStaffFeedbacksParams: UsePaginatedStaffFeedbacksParams
  withActivity?: boolean
}

const {
  emptyStateMessage,
  selectedStatus = 'ALL',
  usePaginatedStaffFeedbacksParams,
  withActivity = true,
} = defineProps<FeedbacksTableProps>()

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
const { isBelowLg } = useAvBreakpoints()

const { formatLastModified, formatTranslatedDateTime } = useDateUtils()

const rows = computed<FeedbackStaffListItemDTO[]>(() => feedbacks.value)

const feedbacksTitle = computed(() => {
  switch (selectedStatus) {
    case EFeedbackStatus.NEW:
      return t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.title.new')

    case EFeedbackStatus.IN_PROCESS:
      return t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.title.unprocessed')

    case EFeedbackStatus.SUBMITTED:
    case EFeedbackStatus.SEEN:
      return t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.title.sent')

    default:
      return t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.title.default')
  }
})

const WIDTH_MAP: Record<string, string | undefined> = {
  student: '15%',
  activity: '25%',
  createdAt: '15%',
  status: '15%',
  iteration: '15%',
  updatedAt: '15%'
}

const columns = computed<AvTableColumn<FeedbackStaffListItemDTO & { access?: string }>[]>(() => {
  const allColumnKeys = ['student', 'activity', 'createdAt', 'status', 'iteration', 'updatedAt'] as const
  const columnKeys = withActivity ? allColumnKeys : allColumnKeys.filter(key => key !== 'activity')

  return columnKeys.map(key => ({
    key,
    label: t(`staff.feedbacks.views.FeedbacksView.FeedbacksTable.columns.${key}`),
    width: WIDTH_MAP[key],
  }))
})
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="feedbacks-table"
  >
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
        <div class="av-col av-gap-sm av-gap-lg--md">
          <span
            class="n5"
            data-testid="feedbacks-table-title"
          >
            {{ feedbacksTitle }}
          </span>

          <div
            v-if="isBelowLg"
            class="av-col av-gap-sm"
          >
            <RouterLink
              v-for="feedback in rows"
              :key="feedback.id"
              :to="{
                name: ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name,
                params: { feedbackId: feedback?.id },
              }"
            >
              <FeedbackCard :feedback="feedback" />
            </RouterLink>
          </div>

          <AvTable
            v-else
            :columns="columns"
            :rows="rows"
            row-key="id"
            data-testid="feedbacks-table-table"
          >
            <template #cell(student)="{ row }">
              <span data-testid="feedback-student-cell">{{ row.student?.firstName }} {{ row.student?.lastName }}</span>
            </template>

            <template
              v-if="withActivity"
              #cell(activity)="{ row }"
            >
              <FeedbackActivityTitle
                :feedback="{
                  id: row.id,
                  status: row.status,
                }"
                :activity="{
                  id: row.activity?.id,
                  title: row?.activity?.title,
                }"
                with-nav
              />
            </template>

            <template #cell(createdAt)="{ row }">
              <span data-testid="feedback-received-at-cell">{{ row.createdAt ? formatLastModified(row.createdAt) : '' }}</span>
            </template>

            <template #cell(status)="{ row }">
              <FeedbackStatusBadge
                :feedback-status="row.status === EFeedbackStatus.SEEN ? EFeedbackStatus.SUBMITTED : row.status"
              />
            </template>

            <template #cell(iteration)="{ row }">
              <FeedbackIterationBadge
                :iteration="row.iteration ?? 0"
                :max-iterations="row.activity?.feedbackAllowedIterations"
              />
            </template>

            <template #cell(updatedAt)="{ row }">
              <span class="b2-regular">
                {{ row.updatedAt ? formatTranslatedDateTime(row.updatedAt, true) : '' }}
              </span>
            </template>
          </AvTable>
        </div>
      </Pagination>
    </QuerySuspense>
  </div>
</template>

<script lang="ts" setup>
import type { FeedbackStaffListItemDTO } from '@/api/avenir-esr'
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { Slot } from 'vue'
import { EFeedbackStatus } from '@/api/avenir-esr'
import Pagination from '@/common/components/Pagination/Pagination.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useDateUtils, useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import FeedbackIterationBadge from '@/features/staff/feedbacks/components/badges/FeedbackIterationBadge/FeedbackIterationBadge.vue'
import FeedbackStatusBadge from '@/features/staff/feedbacks/components/badges/FeedbackStatusBadge/FeedbackStatusBadge.vue'
import { usePaginatedStaffFeedbacks, type UsePaginatedStaffFeedbacksParams } from '@/features/staff/feedbacks/composables/use-paginated-staff-feedbacks/use-paginated-staff-feedbacks'
import FeedbackCard from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbackCard/FeedbackCard.vue'
import { AvButton, AvTable, MDI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbacksTabProps {
  emptyStateMessage?: string
  selectedStatus?: 'ALL' | EFeedbackStatus
  usePaginatedStaffFeedbacksParams: UsePaginatedStaffFeedbacksParams
}

const {
  emptyStateMessage,
  selectedStatus = 'ALL',
  usePaginatedStaffFeedbacksParams,
} = defineProps<FeedbacksTabProps>()

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
const { navigateToStaffActivityFeedbackDetails } = useNavigation()

const { formatLastModified, formatTranslatedDateTime } = useDateUtils()

const rows = computed<FeedbackStaffListItemDTO[]>(() => feedbacks.value)

const feedbacksTitle = computed(() => {
  switch (selectedStatus) {
    case EFeedbackStatus.NEW:
      return t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.title.new')

    case EFeedbackStatus.IN_PROCESS:
      return t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.title.unprocessed')

    case EFeedbackStatus.SUBMITTED:
      return t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.title.sent')

    default:
      return t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.title.default')
  }
})

const columns = computed<AvTableColumn<FeedbackStaffListItemDTO & { access?: string }>[]>(() => [
  {
    key: 'student',
    label: t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.columns.student'),
  },
  {
    key: 'activity',
    label: t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.columns.formation'),
  },
  {
    key: 'createdAt',
    label: t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.columns.receivedAt'),
  },
  {
    key: 'status',
    label: t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.columns.status'),
  },
  {
    key: 'iteration',
    label: t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.columns.iterations'),
  },
  {
    key: 'updatedAt',
    label: t('staff.feedbacks.views.FeedbacksView.FeedbacksTable.columns.lastSaved'),
  },
  {
    key: 'access',
    label: t('global.buttons.access'),
  },
])
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
            v-if="isMobile"
            class="av-col av-gap-sm"
          >
            <RouterLink
              v-for="feedback in rows"
              :key="feedback.id"
              :to="{
                name: ROUTES.STAFF.ACTIVITY_FEEDBACK_DETAILS.name,
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

            <template #cell(access)="{ row }">
              <AvButton
                :label="t('global.buttons.access')"
                :icon="MDI_ICONS.ARROW_RIGHT"
                icon-only
                data-testid="access-button"
                @click="navigateToStaffActivityFeedbackDetails({ feedbackId: row.id })"
              />
            </template>
          </AvTable>
        </div>
      </Pagination>
    </QuerySuspense>
  </div>
</template>

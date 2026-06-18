<script lang="ts" setup>
import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { Slot } from 'vue'
import ActivityStatusBadge from '@/common/activities/badges/ActivityStatusBadge/ActivityStatusBadge.vue'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import Pagination from '@/common/components/Pagination/Pagination.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useDateUtils } from '@/common/composables'
import { useModal } from '@/common/composables/use-modal/use-modal'
import { usePaginatedStaffActivites, type UsePaginatedStaffActivitesParams } from '@/features/staff/activities/composables/use-paginated-staff-activites/use-paginated-staff-activites'
import { mapActivityToActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.utils'
import ActivityCard from '@/features/staff/activities/views/ActivitiesView/components/ActivityCard/ActivityCard.vue'
import ActivityTableTitle from '@/features/staff/activities/views/ActivitiesView/components/ActivityTableTitle/ActivityTableTitle.vue'
import MoreActionsDropdown from '@/features/staff/activities/views/ActivitiesView/components/MoreActionsDropdown/MoreActionsDropdown.vue'
import { AvTable, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivitiesTabProps {
  title: string
  emptyStateMessage?: string
  withStatus?: boolean
  withActionsColumn?: boolean
  usePaginatedStaffActivitiesParams: UsePaginatedStaffActivitesParams
}

const {
  title,
  emptyStateMessage,
  withStatus = false,
  withActionsColumn = false,
  usePaginatedStaffActivitiesParams,
} = defineProps<ActivitiesTabProps>()

const emit = defineEmits<{
  (e: 'updateActivitiesCount', value: number): void
  (e: 'deleteDraftActivity', activityId: string): void
}>()

defineSlots<{
  actions: Slot
}>()

const {
  activities,
  pageInfo,
  isFetching,
  error,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePaginatedStaffActivites(usePaginatedStaffActivitiesParams)

const { t } = useI18n()
const { formatLastModified } = useDateUtils()
const { isMobile } = useAvBreakpoints()

const { showModal: showDeleteModal, displayModal: displayDeleteModal, hideModal: hideDeleteModal } = useModal()
const pendingDeleteId = ref<string | null>(null)

function onDeleteSelected (activityId: string) {
  pendingDeleteId.value = activityId
  displayDeleteModal()
}

function confirmDelete () {
  if (pendingDeleteId.value) {
    emit('deleteDraftActivity', pendingDeleteId.value)
  }
  hideDeleteModal()
  pendingDeleteId.value = null
}

function cancelDelete () {
  hideDeleteModal()
  pendingDeleteId.value = null
}

const rows = computed<ActivityTableRow[]>(() => activities.value.map(mapActivityToActivityTableRow))

const columns = computed<AvTableColumn<ActivityTableRow>[]>(() => [
  {
    key: 'title',
    label: t('staff.activities.views.ActivitiesView.columns.activityName'),
    width: '40%',
  },
  {
    key: 'updatedAt',
    label: t('staff.activities.views.ActivitiesView.columns.lastModification'),
  },
  {
    key: 'owner',
    label: t('staff.activities.views.ActivitiesView.columns.owner'),
  },
  ...(withStatus
    ? [{
        key: 'status' as keyof ActivityTableRow,
        label: t('staff.activities.views.ActivitiesView.columns.status'),
      }]
    : []
  ),
  ...(withActionsColumn
    ? [{
        key: 'actions' as keyof ActivityTableRow,
        label: t('staff.activities.views.ActivitiesView.columns.actions'),
      }]
    : []
  )
])

watch(
  () => pageInfo?.value?.totalElements,
  (count) => { emit('updateActivitiesCount', count ?? 0) },
  { immediate: true },
)
</script>

<template>
  <div
    class="my-workspace-tab av-flex-col-xl"
    data-testid="activities-tab"
  >
    <span
      class="n4"
      data-testid="activities-tab-title"
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
          <ActivityCard
            v-for="activity in rows"
            :key="activity.id"
            :activity="activity"
            :with-status="withStatus"
          />
        </div>
        <AvTable
          v-else
          :columns="columns"
          :rows="rows"
          row-key="id"
          data-testid="activities-tab-table"
        >
          <template #cell(title)="{ row }">
            <ActivityTableTitle :activity="row" />
          </template>

          <template #cell(updatedAt)="{ row }">
            {{ row.updatedAt ? formatLastModified(row.updatedAt) : '' }}
          </template>

          <template
            v-if="withStatus"
            #cell(status)="{ row }"
          >
            <ActivityStatusBadge :status="row.status" />
          </template>

          <template
            v-if="withActionsColumn"
            #cell(actions)="{ row }"
          >
            <MoreActionsDropdown
              :activity-status="row.status"
              @delete-selected="onDeleteSelected(row.id)"
            />
          </template>
        </AvTable>
      </Pagination>
    </QuerySuspense>
  </div>

  <ConfirmationModal
    :show="showDeleteModal"
    :title="t('staff.activities.views.ActivitiesView.MoreActionsDropdown.deleteConfirmation.title')"
    no-description
    @close="cancelDelete"
    @confirm="confirmDelete"
  />
</template>

<script lang="ts" setup>
import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { Slot } from 'vue'
import ActivityStatusBadge from '@/common/activities/badges/ActivityStatusBadge/ActivityStatusBadge.vue'
import Pagination from '@/common/components/Pagination/Pagination.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useDateUtils, useNavigation } from '@/common/composables'
import { useModal } from '@/common/composables/use-modal/use-modal'
import DeleteDraftActivityConfirmationModal from '@/features/staff/activities/components/modals/DeleteDraftActivityConfirmationModal/DeleteDraftActivityConfirmationModal.vue'
import UnpublishActivityConfirmationModal from '@/features/staff/activities/components/modals/UnpublishActivityConfirmationModal/UnpublishActivityConfirmationModal.vue'
import { usePaginatedStaffActivities, type UsePaginatedStaffActivitiesParams } from '@/features/staff/activities/composables/use-paginated-staff-activites/use-paginated-staff-activites'
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
  withActions?: boolean
  usePaginatedStaffActivitiesParams: UsePaginatedStaffActivitiesParams
}

const {
  title,
  emptyStateMessage,
  withStatus = false,
  withActions = false,
  usePaginatedStaffActivitiesParams,
} = defineProps<ActivitiesTabProps>()

const emit = defineEmits<{
  (e: 'updateActivitiesCount', value: number): void
  (e: 'unpublished'): void
  (e: 'deleted'): void
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
} = usePaginatedStaffActivities(usePaginatedStaffActivitiesParams)

const { t } = useI18n()
const { formatLastModified } = useDateUtils()
const { isMobile } = useAvBreakpoints()
const { navigateToStaffActivityFeedbacks } = useNavigation()

const { showModal: showDeleteModal, displayModal: displayDeleteModal, hideModal: hideDeleteModal } = useModal()
const { showModal: showUnpublishModal, displayModal: displayUnpublishModal, hideModal: hideUnpublishModal } = useModal()

const pendingUnpublishId = ref<string | null>(null)
const pendingDeleteId = ref<string | null>(null)

function onUnpublishSelected (activityId: string) {
  pendingUnpublishId.value = activityId
  displayUnpublishModal()
}

function onDeleteSelected (activityId: string) {
  pendingDeleteId.value = activityId
  displayDeleteModal()
}

function onUnpublished () {
  emit('unpublished')
  hideUnpublishModal()
  pendingUnpublishId.value = null
}

function onDeleted () {
  emit('deleted')
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
  ...(withActions
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
  <div class="av-flex-col-xl">
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
            v-if="withActions"
            #cell(actions)="{ row }"
          >
            <MoreActionsDropdown
              :activity-status="row.status"
              :data-activity-id="row.id"
              :data-activity-status="row.status"
              @delete-selected="() => onDeleteSelected(row.id)"
              @unpublish-selected="() => onUnpublishSelected(row.id)"
              @navigate-to-feedbacks-selected="() => navigateToStaffActivityFeedbacks({ id: row.id })"
            />
          </template>
        </AvTable>
      </Pagination>
    </QuerySuspense>

    <UnpublishActivityConfirmationModal
      :show="showUnpublishModal"
      :activity-id="pendingUnpublishId ?? ''"
      @close="hideUnpublishModal"
      @unpublished="onUnpublished"
    />

    <DeleteDraftActivityConfirmationModal
      :show="showDeleteModal"
      :activity-id="pendingDeleteId ?? ''"
      @close="cancelDelete"
      @deleted="onDeleted"
    />
  </div>
</template>

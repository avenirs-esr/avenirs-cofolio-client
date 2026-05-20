<script lang="ts" setup>
import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import { useGetStaffActivityWorkingSpace } from '@/api/avenir-esr'
import ActivityStatusBadge from '@/common/activities/badges/ActivityStatusBadge/ActivityStatusBadge.vue'
import Pagination from '@/common/components/Pagination/Pagination.vue'
import { useDateUtils, usePagination } from '@/common/composables'
import { useStaffActivitiesStore } from '@/features/staff/activities/stores/activities.store'
import { mapActivityToActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.utils'
import ActivityCard from '@/features/staff/activities/views/ActivitiesView/components/ActivityCard/ActivityCard.vue'
import ActivityDraftCreationModal from '@/features/staff/activities/views/ActivitiesView/components/ActivityDraftCreationModal/ActivityDraftCreationModal.vue'
import ActivityTableTitle from '@/features/staff/activities/views/ActivitiesView/components/ActivityTableTitle/ActivityTableTitle.vue'
import { AvButton, AvTable, MDI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { keepPreviousData } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { formatLastModified } = useDateUtils()
const { isMobile } = useAvBreakpoints()

const staffActivitiesStore = useStaffActivitiesStore()

const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(
  toRef(staffActivitiesStore, 'workingSpaceCurrentPage'),
  toRef(staffActivitiesStore, 'workingSpacePageSizeSelected')
)

const params = computed(() => ({
  page: currentPage.value,
  pageSize: pageSizeSelected.value
}))
const { data, error, isFetching } = useGetStaffActivityWorkingSpace(params, { query: { placeholderData: keepPreviousData } })
const activities = computed(() => data.value?.data ?? [])
const pageInfo = computed(() => data.value?.page)

const rows = computed<ActivityTableRow[]>(() => activities.value.map(mapActivityToActivityTableRow))

const columns = computed<AvTableColumn<ActivityTableRow>[]>(() => [
  {
    key: 'title',
    label: t('staff.activities.views.ActivitiesView.MyWorkspaceTab.columns.activityName'),
    width: '40%',
  },
  {
    key: 'updatedAt',
    label: t('staff.activities.views.ActivitiesView.MyWorkspaceTab.columns.lastModification'),
  },
  {
    key: 'owner',
    label: t('staff.activities.views.ActivitiesView.MyWorkspaceTab.columns.owner'),
  },
  {
    key: 'status',
    label: t('staff.activities.views.ActivitiesView.MyWorkspaceTab.columns.status'),
  },
])
</script>

<template>
  <div
    class="my-workspace-tab av-flex-col-xl"
    data-testid="my-workspace-tab"
  >
    <h2
      class="n4"
      data-testid="my-workspace-tab-title"
    >
      {{ t('staff.activities.views.ActivitiesView.MyWorkspaceTab.title', { count: pageInfo?.totalElements ?? 0 }) }}
    </h2>

    <div class="av-row av-justify-end av-py-md">
      <AvButton
        :label="t('staff.activities.views.ActivitiesView.MyWorkspaceTab.createActivity')"
        variant="FLAT"
        :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
        theme="PRIMARY"
        data-testid="create-activity-button"
        @click="staffActivitiesStore.displayAddActivityModal"
      />
    </div>

    <QuerySuspense
      :error="error"
      :is-empty="rows.length === 0"
      :is-loading="isFetching"
      :empty-state-message="t('staff.activities.views.ActivitiesView.MyWorkspaceTab.emptyState')"
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
          />
        </div>
        <AvTable
          v-else
          :columns="columns"
          :rows="rows"
          row-key="id"
          data-testid="my-workspace-table"
        >
          <template #cell(title)="{ row }">
            <ActivityTableTitle :activity="row" />
          </template>

          <template #cell(updatedAt)="{ row }">
            {{ row.updatedAt ? formatLastModified(row.updatedAt) : '' }}
          </template>

          <template #cell(status)="{ row }">
            <ActivityStatusBadge :status="row.status" />
          </template>
        </AvTable>
      </Pagination>
    </QuerySuspense>
  </div>

  <ActivityDraftCreationModal
    :opened="staffActivitiesStore.showAddActivityModal"
    @close="staffActivitiesStore.hideAddActivityModal"
  />
</template>

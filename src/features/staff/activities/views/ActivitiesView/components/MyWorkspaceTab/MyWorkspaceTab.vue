<script lang="ts" setup>
import type { ActivityDetailsDTO, PageInfoDTO } from '@/api/avenir-esr'
import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import { EActivityThematic } from '@/api/avenir-esr'
import Pagination from '@/common/components/Pagination/Pagination.vue'
import { useDateUtils, usePagination } from '@/common/composables'
import { mapActivityToActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.utils'
import ActivityTableTitle from '@/features/staff/activities/views/ActivitiesView/components/ActivityTableTitle/ActivityTableTitle.vue'
import { AvTable, PageSizes } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { formatLastModified } = useDateUtils()

const currentPageRef = ref<number>(0)
const pageSizeRef = ref<PageSizes>(PageSizes.TWELVE)

const { currentPage, pageSizeSelected, onUpdateCurrentPage, onUpdatePageSize } = usePagination(currentPageRef, pageSizeRef)

const placeholderActivities = computed<ActivityDetailsDTO[]>(() => [
  {
    id: '1',
    title: 'Activité "Connaissance de soi" : Définir ses valeurs',
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    banner: { id: 'banner-1', name: 'banner.jpg', url: '' },
    summary: '',
    description: '',
    executionPeriodInfo: '',
    updatedAt: '2025-03-10T14:00:00.000Z',
  },
  {
    id: '2',
    title: 'Activité "Connaissance de soi" : Définir ses valeurs',
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    banner: { id: 'banner-2', name: 'banner.jpg', url: '' },
    summary: '',
    description: '',
    executionPeriodInfo: '',
    updatedAt: '2025-03-10T14:00:00.000Z',
  },
  {
    id: '3',
    title: 'Activité "Connaissance de soi" : Définir ses valeurs',
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    banner: { id: 'banner-3', name: 'banner.jpg', url: '' },
    summary: '',
    description: '',
    executionPeriodInfo: '',
    updatedAt: new Date().toISOString(),
  },
])

// TODO: #1618 fetch activities from  the api
const rows = computed<ActivityTableRow[]>(() => placeholderActivities.value.map(mapActivityToActivityTableRow))

// TODO: #1618 compute total elements from api
const totalElements = computed(() => rows.value.length)

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

// TODO: #1618 forward pageInfo from query result
const pageInfo = computed<PageInfoDTO>(() => ({
  page: currentPage.value,
  pageSize: pageSizeSelected.value,
  totalElements: totalElements.value,
  totalPages: Math.ceil(totalElements.value / pageSizeSelected.value),
}))
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
      {{ t('staff.activities.views.ActivitiesView.MyWorkspaceTab.title', { count: totalElements }) }}
    </h2>

    <Pagination
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <AvTable
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
      </AvTable>
    </Pagination>
  </div>
</template>

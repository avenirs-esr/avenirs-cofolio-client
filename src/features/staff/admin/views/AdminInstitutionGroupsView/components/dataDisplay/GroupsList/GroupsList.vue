<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { Slot } from 'vue'
import type { EGroupType } from '@/api/avenir-esr'
import type { UsePaginatedStaffAdminGroupsParams } from '@/features/staff/admin/composables/use-paginated-staff-admin-groups/use-paginated-staff-admin-groups'
import type { GroupsListRow } from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/dataDisplay/GroupsList/GroupsList.types'
import { AvTable, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import Pagination from '@/common/components/navigation/Pagination/Pagination.vue'
import GroupTypeBadge from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.vue'
import GroupName from '@/features/staff/admin/components/base/GroupName/GroupName.vue'
import GroupParentName from '@/features/staff/admin/components/base/GroupParentName/GroupParentName.vue'
import { usePaginatedStaffAdminGroups } from '@/features/staff/admin/composables/use-paginated-staff-admin-groups/use-paginated-staff-admin-groups'
import { useStaffAdminGroupsStore } from '@/features/staff/admin/stores/groups.store'
import GroupCard from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/cards/GroupCard/GroupCard.vue'

export interface GroupsListProps {
  keyword?: string
  types?: EGroupType[]
}

const props = defineProps<GroupsListProps>()

defineSlots<{
  actions: Slot
}>()

const { t } = useI18n()
const staffAdminGroupsStore = useStaffAdminGroupsStore()
const { isBelowLg } = useAvBreakpoints()

const usePaginatedStaffAdminGroupsParams = computed<UsePaginatedStaffAdminGroupsParams>(() => ({
  currentPageRef: toRef(staffAdminGroupsStore, 'groupsCurrentPage'),
  pageSizeRef: toRef(staffAdminGroupsStore, 'groupsPageSizeSelected'),
  typesRef: toRef(props, 'types'),
  keywordRef: toRef(props, 'keyword'),
}))

const {
  groups,
  pageInfo,
  isFetching,
  error,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePaginatedStaffAdminGroups(usePaginatedStaffAdminGroupsParams.value)

const rows = computed<GroupsListRow[]>(() => groups.value.map(group => ({
  ...group,
  parentName: group.parent?.name ?? ''
})))

const WIDTH_MAP: Record<string, string | undefined> = {
  name: '30%',
  type: '20%',
  parentName: '30%',
  usersCount: '20%'
}

const columns = computed<AvTableColumn<GroupsListRow>[]>(() => {
  return (['name', 'type', 'parentName', 'usersCount'] as const).map(key => ({
    key,
    label: t(`staff.admin.views.AdminInstitutionGroupsView.components.dataDisplay.GroupsList.columns.${key}`),
    width: WIDTH_MAP[key]
  }))
})
</script>

<template>
  <QuerySuspense
    :is-loading="isFetching"
    :error="error"
    :is-empty="groups.length === 0"
    :empty-state-message="t('staff.admin.views.AdminInstitutionGroupsView.components.dataDisplay.GroupsList.emptyStateMessage')"
    preserve-content
  >
    <Pagination
      v-if="pageInfo"
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <div
        v-if="isBelowLg"
        class="av-col av-gap-sm"
        data-testid="groups-list-cards"
      >
        <GroupCard
          v-for="group in groups"
          :key="group.id"
          :group="group"
        />
      </div>
      <AvTable
        v-else
        :rows="rows"
        :columns="columns"
        row-key="id"
        data-testid="groups-list-table"
      >
        <template #cell(name)="{ row }">
          <GroupName
            :group="row"
            with-nav
          />
        </template>
        <template #cell(type)="{ row }">
          <GroupTypeBadge :type="row.type" />
        </template>
        <template #cell(parentName)="{ row }">
          <GroupParentName :group="row" />
        </template>
        <template #cell(usersCount)="{ row }">
          <span
            class="b2-regular"
            data-testid="group-list-users-count-cell"
          >
            {{ row.usersCount }}
          </span>
        </template>
      </AvTable>
    </Pagination>
  </QuerySuspense>
</template>

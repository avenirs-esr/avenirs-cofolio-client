<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { Slot } from 'vue'
import type { EGroupType } from '@/api/avenir-esr'
import type { GroupsListRow } from '@/features/staff/admin/components/dataDisplay/GroupsList/GroupsList.types'
import type { UsePaginatedStaffAdminGroupsParams } from '@/features/staff/admin/composables/use-paginated-staff-admin-groups/use-paginated-staff-admin-groups'
import { useI18n } from 'vue-i18n'
import { useGetSubGroupsOfGroup } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import Pagination from '@/common/components/navigation/Pagination/Pagination.vue'
import GroupOverviewList from '@/features/staff/admin/components/base/GroupOverviewList/GroupOverviewList.vue'
import { usePaginatedStaffAdminGroups } from '@/features/staff/admin/composables/use-paginated-staff-admin-groups/use-paginated-staff-admin-groups'
import { useStaffAdminGroupsStore } from '@/features/staff/admin/stores/groups.store'

export interface GroupsListProps {
  keyword?: string
  types?: EGroupType[]
  groupId?: string
}

const props = defineProps<GroupsListProps>()

defineSlots<{
  actions: Slot
}>()

const { t } = useI18n()
const staffAdminGroupsStore = useStaffAdminGroupsStore()

const groupId = computed(() => props.groupId)
const subGroupMode = computed(() => !!groupId.value)

const usePaginatedStaffAdminGroupsParams = computed<UsePaginatedStaffAdminGroupsParams>(() => ({
  currentPageRef: toRef(staffAdminGroupsStore, 'groupsCurrentPage'),
  pageSizeRef: toRef(staffAdminGroupsStore, 'groupsPageSizeSelected'),
  typesRef: toRef(props, 'types'),
  keywordRef: toRef(props, 'keyword'),
  enabledRef: computed(() => !subGroupMode.value)
}))

const {
  groups,
  pageInfo,
  isFetching: isFetchingGroups,
  error: errorGroups,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePaginatedStaffAdminGroups(usePaginatedStaffAdminGroupsParams.value)

const { data: subGroupsData, error: subGroupsError, isFetching: subGroupsIsFetching } = useGetSubGroupsOfGroup(
  groupId.value ?? '',
  { query: { enabled: !!groupId.value } }
)
const subGroups = computed(() => subGroupsData.value ?? [])

const groupsRows = computed<GroupsListRow[]>(() => groups.value.map(group => ({
  ...group,
  parentName: group.parent?.name ?? ''
})))
const GROUP_WIDTH_MAP: Record<string, string | undefined> = {
  name: '35%',
  type: '25%',
  parentName: '30%',
  usersCount: '10%'
}
const groupColumns = computed<AvTableColumn<GroupsListRow>[]>(() => {
  return (['name', 'type', 'parentName', 'usersCount'] as const).map(key => ({
    key,
    label: t(`staff.admin.groupsTable.columns.${key}`),
    width: GROUP_WIDTH_MAP[key]
  }))
})

const subGroupsRows = computed<GroupsListRow[]>(() => subGroups.value)
const SUBGROUP_WIDTH_MAP: Record<string, string | undefined> = {
  name: '80%',
  type: '20%',
}
const subGroupColumns = computed<AvTableColumn<GroupsListRow>[]>(() => {
  return (['name', 'type'] as const).map(key => ({
    key,
    label: t(`staff.admin.groupsTable.columns.${key}`),
    width: SUBGROUP_WIDTH_MAP[key]
  }))
})

const rows = computed(() => subGroupMode.value ? subGroupsRows.value : groupsRows.value)
const columns = computed(() => subGroupMode.value ? subGroupColumns.value : groupColumns.value)
const isFetching = computed(() => subGroupMode.value ? subGroupsIsFetching.value : isFetchingGroups.value)
const error = computed(() => subGroupMode.value ? subGroupsError.value : errorGroups.value)
</script>

<template>
  <QuerySuspense
    :is-loading="isFetching"
    :error="error"
    :is-empty="rows.length === 0"
    :empty-state-message="subGroupMode ? t('staff.admin.components.dataDisplay.GroupsList.noResults.subGroupMode') : t('global.information.noResults')"
    preserve-content
  >
    <GroupOverviewList
      v-if="subGroupMode"
      :rows="rows"
      :columns="columns"
      :sub-group-mode="subGroupMode"
      data-testid="sub-groups-list"
    />
    <Pagination
      v-else-if="pageInfo"
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <GroupOverviewList
        :rows="rows"
        :columns="columns"
        :sub-group-mode="subGroupMode"
        data-testid="groups-list"
      />
    </Pagination>
  </QuerySuspense>
</template>

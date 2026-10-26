<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import { AvTable, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EGroupType } from '@/api/avenir-esr'
import Card from '@/common/components/cards/Card/Card.vue'
import GroupTypeBadge from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.vue'
import GroupName from '@/features/staff/admin/components/base/GroupName/GroupName.vue'
import { getUserGroupsByType, getUserGroupsByTypeExcluding } from '@/features/staff/admin/utils/groups.utils'

interface UserGroupsTableRow {
  id: string
  groupName: string
  groupeType?: EGroupType
}

interface UserGroupsTableProps {
  user: ExternalUserDetailDTO
  programMode?: boolean
}

const { user, programMode = false } = defineProps<UserGroupsTableProps>()

const { t } = useI18n()
const { isBelowLg } = useAvBreakpoints()

const programGroups = computed(() => getUserGroupsByType(user, EGroupType.PROGRAM))
const nonProgramGroups = computed(() => getUserGroupsByTypeExcluding(user, EGroupType.PROGRAM))
const groups = computed(() => programMode ? programGroups.value : nonProgramGroups.value)

const rows = computed<UserGroupsTableRow[]>(() => groups.value.map(group => ({
  id: group.id,
  groupName: group.name,
  groupeType: !programMode ? group.type : undefined
})))

const WIDTH_MAP: Record<string, string> = {
  groupName: '75%',
  groupeType: '25%'
}

const groupNameColumn = computed(() => ({
  key: 'groupName' as keyof UserGroupsTableRow,
  label: t(`staff.admin.views.InstitutionUserDetailedView.components.dataDisplay.UserGroupsTable.columns.groupName.${programMode ? 'program' : 'group'}`),
  width: WIDTH_MAP.groupName
}))

const programColumns = computed<AvTableColumn<UserGroupsTableRow>[]>(() => [groupNameColumn.value])
const nonProgramColumns = computed<AvTableColumn<UserGroupsTableRow>[]>(() => [
  groupNameColumn.value,
  {
    key: 'groupeType',
    label: t(`staff.admin.views.InstitutionUserDetailedView.components.dataDisplay.UserGroupsTable.columns.groupeType`),
    width: WIDTH_MAP.groupeType
  }
])

const columns = computed<AvTableColumn<UserGroupsTableRow>[]>(() => {
  return (programMode ? programColumns.value : nonProgramColumns.value)
})
</script>

<template>
  <div
    v-if="isBelowLg"
    class="av-col av-gap-sm"
    data-testid="users-overview-list-cards"
  >
    <Card
      v-for="group in groups"
      :key="group.id"
      radius="var(--radius-lg)"
    >
      <div class="av-col av-gap-sm">
        <GroupName :group="group" />
        <GroupTypeBadge
          v-if="!programMode"
          :type="group.type"
        />
      </div>
    </Card>
  </div>
  <AvTable
    v-else
    :rows="rows"
    :columns="columns"
    row-key="id"
    data-testid="users-overview-list-table"
  >
    <template #cell(groupName)="{ row }">
      <span class="b2-bold">{{ row.groupName }}</span>
    </template>
    <template #cell(groupeType)="{ row }">
      <GroupTypeBadge :type="row.groupeType" />
    </template>
  </AvTable>
</template>

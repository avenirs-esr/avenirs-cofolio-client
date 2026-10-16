<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { Slot } from 'vue'
import type { GroupOverviewDTO } from '@/api/avenir-esr'
import { AvTable, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import GroupTypeBadge from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/badges/GroupTypeBadge/GroupTypeBadge.vue'
import GroupCard from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/cards/GroupCard/GroupCard.vue'
import GroupsListName from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/dataDisplay/GroupsListName/GroupsListName.vue'
import GroupsListParentName from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/dataDisplay/GroupsListParentName/GroupsListParentName.vue'

export interface GroupsListProps {
  groups: GroupOverviewDTO[]
}

const { groups } = defineProps<GroupsListProps>()

defineSlots<{
  actions: Slot
}>()

const { t } = useI18n()
const { isBelowLg } = useAvBreakpoints()

const rows = computed(() => groups)

const WIDTH_MAP: Record<string, string | undefined> = {
  name: '30%',
  type: '20%',
  parentName: '30%',
  usersCount: '20%'
}

const columns = computed<AvTableColumn<Omit<GroupOverviewDTO, 'id' | 'parentId'>>[]>(() => {
  return (['name', 'type', 'parentName', 'usersCount'] as const).map(key => ({
    key,
    label: t(`staff.admin.views.AdminInstitutionGroupsView.components.dataDisplay.GroupsList.columns.${key}`),
    width: WIDTH_MAP[key]
  }))
})
</script>

<template>
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
      <GroupsListName :group="row" />
    </template>
    <template #cell(type)="{ row }">
      <GroupTypeBadge :type="row.type" />
    </template>
    <template #cell(parentName)="{ row }">
      <GroupsListParentName :group="row" />
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
</template>

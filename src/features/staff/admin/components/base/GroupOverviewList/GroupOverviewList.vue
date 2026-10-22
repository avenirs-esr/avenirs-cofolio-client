<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { GroupsListRow } from '@/features/staff/admin/components/dataDisplay/GroupsList/GroupsList.types'
import { AvTable, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import GroupTypeBadge from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.vue'
import GroupName from '@/features/staff/admin/components/base/GroupName/GroupName.vue'
import GroupParentName from '@/features/staff/admin/components/base/GroupParentName/GroupParentName.vue'
import GroupOverviewCard from '@/features/staff/admin/components/cards/GroupOverviewCard/GroupOverviewCard.vue'

interface GroupOverviewListProps {
  rows: GroupsListRow[]
  columns: AvTableColumn<GroupsListRow>[]
  subGroupMode: boolean
}

defineProps<GroupOverviewListProps>()

const { isBelowLg } = useAvBreakpoints()
</script>

<template>
  <div
    v-if="isBelowLg"
    class="av-col av-gap-sm"
    data-testid="group-overview-list-cards"
  >
    <GroupOverviewCard
      v-for="group in rows"
      :key="group.id"
      :group="group"
      :is-sub-group="subGroupMode"
    />
  </div>
  <AvTable
    v-else
    :rows="rows"
    :columns="columns"
    row-key="id"
    data-testid="group-overview-list-table"
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
    <template
      v-if="!subGroupMode"
      #cell(parentName)="{ row }"
    >
      <GroupParentName :group="row" />
    </template>
    <template
      v-if="!subGroupMode"
      #cell(usersCount)="{ row }"
    >
      <span
        class="b2-regular"
        data-testid="users-count-cell"
      >
        {{ row.usersCount }}
      </span>
    </template>
  </AvTable>
</template>

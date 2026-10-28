<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { UsersListRow } from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.types'
import { AvTable, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import GroupName from '@/features/staff/admin/components/base/GroupName/GroupName.vue'
import UserName from '@/features/staff/admin/components/base/UserName/UserName.vue'
import UsersOverviewCard from '@/features/staff/admin/components/cards/UsersOverviewCard/UsersOverviewCard.vue'

interface UsersOverviewListProps {
  rows: UsersListRow[]
  columns: AvTableColumn<UsersListRow>[]
}

defineProps<UsersOverviewListProps>()

const { isBelowLg } = useAvBreakpoints()
</script>

<template>
  <div
    v-if="isBelowLg"
    class="av-col av-gap-sm"
    data-testid="users-overview-list-cards"
  >
    <UsersOverviewCard
      v-for="row in rows"
      :key="row.id"
      :user="row.user"
      :formations="row.formations"
      :groups="row.groups"
    />
  </div>
  <AvTable
    v-else
    :rows="rows"
    :columns="columns"
    row-key="id"
    data-testid="users-overview-list-table"
  >
    <template #cell(user)="{ row }">
      <UserName
        :user="row.user"
        with-nav
      />
    </template>
    <template #cell(formations)="{ row }">
      <ul
        v-if="row.formations?.length"
        data-testid="formations-list"
      >
        <li
          v-for="formation in row.formations"
          :key="formation.id"
          class="b2-regular"
        >
          <GroupName
            :group="formation"
            with-nav
          />
        </li>
      </ul>
    </template>
    <template #cell(groups)="{ row }">
      <ul
        v-if="row.groups?.length"
        data-testid="groups-list"
      >
        <li
          v-for="group in row.groups"
          :key="group.id"
          class="b2-regular"
        >
          <GroupName
            :group="group"
            with-nav
          />
        </li>
      </ul>
    </template>
  </AvTable>
</template>

<style>
li{
  list-style: none;
}
</style>

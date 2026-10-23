<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { UsersListRow } from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.types'
import { AvButton, AvTable, CUIDA_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import Card from '@/common/components/cards/Card/Card.vue'
import { useIdentifyRoute } from '@/common/composables/use-identify-route/use-identitfy-route'
import { ROUTES } from '@/common/constants'
import { toFullName } from '@/common/utils/user/user'
import UserInfo from '@/features/staff/admin/components/base/UserInfo/UserInfo.vue'

interface UsersOverviewListProps {
  rows: UsersListRow[]
  columns: AvTableColumn<UsersListRow>[]
}

defineProps<UsersOverviewListProps>()

const { isBelowLg } = useAvBreakpoints()
const { isStaffAdminGroupsRoute } = useIdentifyRoute()

const route = useRoute()

const groupId = computed(() => route.params.id as string)

const targetRouteName = computed(() => isStaffAdminGroupsRoute.value
  ? ROUTES.STAFF.ADMIN.GROUP.USER.name
  : ROUTES.STAFF.ADMIN.USER.name
)

function getTo (userId: string) {
  return {
    name: targetRouteName.value,
    params: { userId, groupId: groupId.value },
  }
}
</script>

<template>
  <div
    v-if="isBelowLg"
    class="av-col av-gap-sm"
    data-testid="users-overview-list-cards"
  >
    <RouterLink
      v-for="row in rows"
      :key="row.id"
      :to="getTo(row.user.id)"
    >
      <Card radius="var(--radius-lg)">
        <UserInfo :user="row.user" />
      </Card>
    </RouterLink>
  </div>
  <AvTable
    v-else
    :rows="rows"
    :columns="columns"
    row-key="id"
    data-testid="users-overview-list-table"
  >
    <template #cell(user)="{ row }">
      <UserInfo :user="row.user" />
    </template>
    <template #cell(actions)="{ row }">
      <AvButton
        :label="`Accéder au détail de ${toFullName(row.user.firstName, row.user.lastName)}`"
        :icon="CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
        icon-only
        size="LG"
        :to="getTo(row.user.id)"
      />
    </template>
  </AvTable>
</template>

<style lang="scss" scoped>
.av-card:hover {
  border: 1px solid var(--dark-background-primary1) !important;
  box-shadow: 0 0 0 2px var(--dark-background-primary1);
}
</style>

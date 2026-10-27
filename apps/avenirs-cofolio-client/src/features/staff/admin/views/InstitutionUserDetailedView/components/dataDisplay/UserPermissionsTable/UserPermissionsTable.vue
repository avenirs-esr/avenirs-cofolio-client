<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { EAuthorizationEntityType, ERole } from '@/api/avenir-esr'
import { AvTable, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import Card from '@/common/components/cards/Card/Card.vue'
import UserRoleBadge from '@/features/staff/admin/components/badges/UserRoleBadge/UserRoleBadge.vue'

interface UserPermissionsTableRow {
  id: ERole
  name: string
  description: string
  type?: EAuthorizationEntityType
}

interface UserPermissionsTableProps {
  roles: ERole[]
}

const { roles } = defineProps<UserPermissionsTableProps>()

const { t } = useI18n()
const { isBelowLg } = useAvBreakpoints()

const rows = computed<UserPermissionsTableRow[]>(() => roles.map(role => ({
  id: role,
  name: t(`global.roles.${role}.label`),
  description: t(`global.roles.${role}.description`),
})))

const WIDTH_MAP: Record<string, string> = {
  name: '30%',
  description: '70%'
}

const columns = computed<AvTableColumn<UserPermissionsTableRow>[]>(() => {
  return (['name', 'description'] as const).map(key => ({
    key,
    label: t(`staff.admin.views.InstitutionUserDetailedView.components.dataDisplay.UserPermissionsTable.columns.${key}`),
    width: WIDTH_MAP[key]
  }))
})
</script>

<template>
  <div
    v-if="isBelowLg"
    class="av-col av-gap-sm"
    data-testid="user-permissions-cards"
  >
    <Card
      v-for="row in rows"
      :key="row.id"
      radius="var(--radius-lg)"
    >
      <div class="av-col av-gap-sm">
        <UserRoleBadge :role="row.id" />
        <span
          class="b2-regular"
          data-testid="permission-description"
        >
          {{ row.description }}
        </span>
      </div>
    </Card>
  </div>
  <AvTable
    v-else
    :rows="rows"
    :columns="columns"
    row-key="id"
    data-testid="user-permissions-table"
  >
    <template #cell(name)="{ row }">
      <UserRoleBadge :role="row.id" />
    </template>
    <template #cell(description)="{ row }">
      <span
        class="b2-regular"
        data-testid="permission-description"
      >
        {{ row.description }}
      </span>
    </template>
  </AvTable>
</template>

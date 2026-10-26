<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { EUniverse, ExternalUserDetailDTO } from '@/api/avenir-esr'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { AvTable, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import Card from '@/common/components/cards/Card/Card.vue'
import UserInfo from '@/features/staff/admin/components/base/UserInfo/UserInfo.vue'
import UniversesList from '@/features/staff/admin/views/InstitutionUserDetailedView/components/base/UniversesList/UniversesList.vue'

interface UserDetailsTableRow {
  id: string
  user: UserInfoType
  institution: string
  universes: EUniverse[]
}

interface UserDetailsTableProps {
  user: ExternalUserDetailDTO
  universes: EUniverse[]
}

const { user, universes } = defineProps<UserDetailsTableProps>()

const { t } = useI18n()
const { isBelowLg } = useAvBreakpoints()

const rows = computed<UserDetailsTableRow[]>(() => [{
  id: user.id,
  user,
  institution: user.institution.name,
  universes
}])

const columns = computed<AvTableColumn<UserDetailsTableRow>[]>(() => {
  return (['user', 'institution', 'universes'] as const).map(key => ({
    key,
    label: t(`staff.admin.views.InstitutionUserDetailedView.components.dataDisplay.UserDetailsTable.columns.${key}`)
  }))
})
</script>

<template>
  <div
    v-if="isBelowLg"
    class="av-col av-gap-sm"
    data-testid="users-details-cards"
  >
    <Card radius="var(--radius-lg)">
      <div class="av-col av-gap-sm">
        <UserInfo :user="user" />
        <div class="av-col">
          <span class="b2-bold">{{ t('global.colon', { before: t('staff.admin.views.InstitutionUserDetailedView.components.dataDisplay.UserDetailsTable.columns.institution') }) }}</span>
          <span class="b2-regular">{{ user.institution.name }}</span>
        </div>
        <div class="av-col">
          <span class="b2-bold">{{ t('global.colon', { before: t('staff.admin.views.InstitutionUserDetailedView.components.dataDisplay.UserDetailsTable.columns.universes') }) }}</span>
          <UniversesList :universes="universes" />
        </div>
      </div>
    </Card>
  </div>
  <AvTable
    v-else
    :rows="rows"
    :columns="columns"
    row-key="id"
    data-testid="users-details-table"
  >
    <template #cell(user)="{ row }">
      <UserInfo :user="row.user" />
    </template>
    <template #cell(institution)="{ row }">
      <span class="b2-regular">{{ row.institution }}</span>
    </template>
    <template #cell(universes)="{ row }">
      <UniversesList :universes="row.universes" />
    </template>
  </AvTable>
</template>

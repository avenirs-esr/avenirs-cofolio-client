<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { ContextualAuthorizationDTO, EAuthorization, EAuthorizationEntityType } from '@/api/avenir-esr'
import { AvTable, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import Card from '@/common/components/cards/Card/Card.vue'
import AuthorizationTypeBadge from '@/features/staff/admin/views/InstitutionUserDetailedView/components/badges/AuthorizationTypeBadge/AuthorizationTypeBadge.vue'
import AuthorizationEntityName from '@/features/staff/admin/views/InstitutionUserDetailedView/components/base/UniversesList/AuthorizationEntityName/AuthorizationEntityName.vue'

interface UserContextualAuthorizationsTableRow {
  id: string
  entityName: string
  entityType: EAuthorizationEntityType
  authorization: EAuthorization
  authorizationDescription: string
}

interface UserContextualAuthorizationsTableProps {
  contextualAuthorizations: ContextualAuthorizationDTO[]
}

const { contextualAuthorizations } = defineProps<UserContextualAuthorizationsTableProps>()

const { t } = useI18n()
const { isBelowLg } = useAvBreakpoints()

const rows = computed<UserContextualAuthorizationsTableRow[]>(() => contextualAuthorizations
  .flatMap(contextualAuthorization => contextualAuthorization.authorizations
    .map(authorization => ({
      id: contextualAuthorization.entityId,
      entityName: contextualAuthorization.entityName,
      entityType: contextualAuthorization.entityType,
      authorization,
      authorizationDescription: t(`staff.admin.views.InstitutionUserDetailedView.components.dataDisplay.UserContextualAuthorizationsTable.authorizationDescriptions.${authorization}`)
    }))))

const WIDTH_MAP: Record<string, string> = {
  entityName: '40%',
  authorization: '20%',
  authorizationDescription: '40%'
}

const columns = computed<AvTableColumn<UserContextualAuthorizationsTableRow>[]>(() => {
  return (['entityName', 'authorization', 'authorizationDescription'] as const).map(key => ({
    key,
    label: t(`staff.admin.views.InstitutionUserDetailedView.components.dataDisplay.UserContextualAuthorizationsTable.columns.${key}`),
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
        <span class="b2-bold">{{ row.entityName }}</span>
        <AuthorizationTypeBadge :type="row.authorization" />
        <span
          class="b2-regular"
          data-testid="authorization-description"
        >
          {{ row.authorizationDescription }}
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
    <template #cell(entityName)="{ row }">
      <AuthorizationEntityName
        :entity="{ id: row.id, name: row.entityName, type: row.entityType }"
        with-nav
      />
    </template>
    <template #cell(authorization)="{ row }">
      <AuthorizationTypeBadge :type="row.authorization" />
    </template>
    <template #cell(authorizationDescription)="{ row }">
      <span
        class="b2-regular"
        data-testid="authorization-description"
      >
        {{ row.authorizationDescription }}
      </span>
    </template>
  </AvTable>
</template>

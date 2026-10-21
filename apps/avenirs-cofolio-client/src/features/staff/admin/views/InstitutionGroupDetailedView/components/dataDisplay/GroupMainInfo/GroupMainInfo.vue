<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { Slot } from 'vue'
import type { GroupDTO } from '@/api/avenir-esr'
import type { GroupMainInfoRow } from '@/features/staff/admin/views/InstitutionGroupDetailedView/components/dataDisplay/GroupMainInfo/GroupMainInfo.types'
import { AvTable, MDI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import GroupTypeBadge from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.vue'
import GroupName from '@/features/staff/admin/components/base/GroupName/GroupName.vue'
import GroupParentName from '@/features/staff/admin/components/base/GroupParentName/GroupParentName.vue'
import GroupCard from '@/features/staff/admin/views/InstitutionGroupDetailedView/components/cards/GroupCard/GroupCard.vue'

export interface GroupMainInfoProps {
  group: GroupDTO
}

const { group } = defineProps<GroupMainInfoProps>()

defineSlots<{
  actions: Slot
}>()

const { t } = useI18n()
const { isBelowLg } = useAvBreakpoints()

const rows = computed<GroupMainInfoRow[]>(() => [{
  ...group,
  institutionName: group.institution?.name ?? '',
  parentName: group.parent?.name ?? ''
}])

const WIDTH_MAP: Record<string, string | undefined> = {
  name: '30%',
  type: '20%',
  institutionName: '20%',
  parentName: '20%',
  usersCount: '10%'
}

const columns = computed<AvTableColumn<GroupMainInfoRow>[]>(() => {
  return (['name', 'type', 'institutionName', 'parentName', 'usersCount'] as const).map(key => ({
    key,
    label: t(`staff.admin.groupsTable.columns.${key}`),
    width: WIDTH_MAP[key]
  }))
})
</script>

<template>
  <div class="av-col av-gap-sm">
    <IconTitleCardContainer
      :title-icon="MDI_ICONS.INFORMATION_OUTLINE"
      :title="t('staff.admin.views.InstitutionGroupDetailedView.components.dataDisplay.GroupMainInfo.title')"
      background-color="var(--other-background-base)"
    >
      <GroupCard
        v-if="isBelowLg"
        :group="group"
      />
      <AvTable
        v-else
        :rows="rows"
        :columns="columns"
        row-key="id"
        data-testid="group-main-info-table"
      >
        <template #cell(name)="{ row }">
          <GroupName :group="row" />
        </template>
        <template #cell(type)="{ row }">
          <GroupTypeBadge :type="row.type" />
        </template>
        <template #cell(institutionName)="{ row }">
          <span
            class="b2-regular"
            data-testid="group-list-institution-name-cell"
          >
            {{ row.institutionName }}
          </span>
        </template>
        <template #cell(parentName)="{ row }">
          <GroupParentName
            :group="row"
            with-nav
          />
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
    </IconTitleCardContainer>
  </div>
</template>

<script lang="ts" setup>
import type { GroupOverviewDTO } from '@/api/avenir-esr'
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import Card from '@/common/components/cards/Card/Card.vue'
import { ROUTES } from '@/common/constants'
import GroupTypeBadge from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.vue'

export interface GroupOverviewCardProps {
  group: GroupOverviewDTO
  isSubGroup?: boolean
}

const { group, isSubGroup = false } = defineProps<GroupOverviewCardProps>()

const { t } = useI18n()

const nameRef = ref<HTMLElement | null>(null)
const parentNameRef = ref<HTMLElement | null>(null)

const { isTruncated: isNameRefTruncated } = useTextTruncation(nameRef)
const { isTruncated: isParentNameTruncated } = useTextTruncation(parentNameRef)
</script>

<template>
  <RouterLink
    :to="{
      name: ROUTES.STAFF.ADMIN.GROUP.DEFAULT.name,
      params: { id: group.id },
    }"
  >
    <Card
      background-color="var(--card)"
      title-background="var(--card)"
      class="group-overview-card"
      radius="var(--radius-lg)"
      data-testid="group-overview-card"
      :data-group-id="group.id"
    >
      <div class="av-col av-gap-sm">
        <AvTooltip
          :content="group.name"
          :disabled="!isNameRefTruncated"
        >
          <span
            ref="nameRef"
            class="b1-regular av-text-text1 av-max-lines"
            data-testid="name"
          >
            {{ group.name }}
          </span>
        </AvTooltip>

        <GroupTypeBadge :type="group.type" />

        <AvTooltip
          v-if="group.parent && !isSubGroup"
          :content="group.parent.name"
          :disabled="!isParentNameTruncated"
        >
          <span
            ref="parentNameRef"
            class="b2-regular av-max-lines"
            data-testid="parent-name"
          >
            {{ t('global.colon', { before: t('staff.admin.groupsTable.columns.parentName') }) }}
            {{ group.parent.name }}
          </span>
        </AvTooltip>

        <span
          v-if="!isSubGroup"
          class="b2-regular"
          data-testid="users-count"
        >
          {{ t('global.colon', { before: t('staff.admin.views.AdminInstitutionGroupsView.components.cards.GroupOverviewCard.labels.usersCount', { count: group.usersCount }) }) }}
          {{ group.usersCount }}
        </span>
      </div>
    </Card>
  </RouterLink>
</template>

<style lang="scss" scoped>
.av-card:hover {
  border: 1px solid var(--dark-background-primary1) !important;
  box-shadow: 0 0 0 2px var(--dark-background-primary1);
}

.group-overview-card {
  --max-lines: 2;
}
</style>

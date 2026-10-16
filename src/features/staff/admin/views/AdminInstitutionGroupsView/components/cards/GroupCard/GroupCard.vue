<script lang="ts" setup>
import type { GroupOverviewDTO } from '@/api/avenir-esr'
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import Card from '@/common/components/cards/Card/Card.vue'
import { ROUTES } from '@/common/constants'
import GroupTypeBadge from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/badges/GroupTypeBadge/GroupTypeBadge.vue'

export interface GroupCardProps {
  group: GroupOverviewDTO
}

const { group } = defineProps<GroupCardProps>()

const { t } = useI18n()

const nameRef = ref<HTMLElement | null>(null)
const parentNameRef = ref<HTMLElement | null>(null)

const { isTruncated: isNameRefTruncated } = useTextTruncation(nameRef)
const { isTruncated: isParentNameTruncated } = useTextTruncation(parentNameRef)
</script>

<template>
  <RouterLink
    :to="{
      name: ROUTES.STAFF.ADMIN.GROUP.name,
      params: { id: group.id },
    }"
  >
    <Card
      background-color="var(--card)"
      title-background="var(--card)"
      class="group-card"
      data-testid="group-card"
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
          v-if="group.parentName"
          :content="group.parentName"
          :disabled="!isParentNameTruncated"
        >
          <span
            ref="parentNameRef"
            class="b2-regular av-max-lines"
            data-testid="parent-name"
          >
            {{ t('global.colon', { before: t('staff.admin.views.AdminInstitutionGroupsView.components.dataDisplay.GroupsList.columns.parentName') }) }}
            {{ group.parentName }}
          </span>
        </AvTooltip>

        <span
          class="b2-regular"
          data-testid="users-count"
        >
          {{ t('global.colon', { before: t('staff.admin.views.AdminInstitutionGroupsView.components.cards.GroupCard.labels.usersCount', { count: group.usersCount }) }) }}
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

.group-card {
  --max-lines: 2;
}
</style>

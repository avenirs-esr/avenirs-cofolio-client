<script lang="ts" setup>
import type { GroupDTO } from '@/api/avenir-esr'
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import Card from '@/common/components/cards/Card/Card.vue'
import GroupTypeBadge from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.vue'
import GroupParentName from '@/features/staff/admin/components/base/GroupParentName/GroupParentName.vue'

export interface DetailedGroupCardProps {
  group: GroupDTO
}

const { group } = defineProps<DetailedGroupCardProps>()

const { t } = useI18n()

const nameRef = ref<HTMLElement | null>(null)
const institutionNameRef = ref<HTMLElement | null>(null)

const { isTruncated: isNameRefTruncated } = useTextTruncation(nameRef)
const { isTruncated: isInstitutionNameTruncated } = useTextTruncation(institutionNameRef)
</script>

<template>
  <Card
    background-color="var(--card)"
    title-background="var(--card)"
    class="detailed-group-card"
    data-testid="detailed-group-card"
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
        :content="group.institution.name"
        :disabled="!isInstitutionNameTruncated"
      >
        <span
          ref="institutionNameRef"
          class="b2-regular av-max-lines"
          data-testid="institution-name"
        >
          {{ t('global.colon', { before: t('staff.admin.views.InstitutionGroupDetailedView.components.dataDisplay.GroupMainInfo.columns.institutionName') }) }}
          {{ group.institution.name }}
        </span>
      </AvTooltip>

      <div
        v-if="group.parent"
        class="av-row av-align-baseline av-wrap av-gap-xxs"
      >
        <span
          class="b2-regular av-max-lines"
          data-testid="parent-name"
        >
          {{ t('global.colon', { before: t('staff.admin.views.InstitutionGroupDetailedView.components.dataDisplay.GroupMainInfo.columns.parentName') }) }}
        </span>
        <GroupParentName
          :group="group"
          with-nav
        />
      </div>

      <span
        class="b2-regular"
        data-testid="users-count"
      >
        {{ t('global.colon', { before: t('staff.admin.views.InstitutionGroupDetailedView.components.cards.DetailedGroupCard.labels.usersCount', { count: group.usersCount }) }) }}
        {{ group.usersCount }}
      </span>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.detailed-group-card {
  --max-lines: 2;
}
</style>

<script setup lang="ts">
import { ICONS } from '@/common/constants'
import { AssociationBadgeType } from '@/common/types'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociationBadgeProps {
  count: number
  type: AssociationBadgeType
}

const { count, type } = defineProps<AssociationBadgeProps>()

const { t } = useI18n()

const ICON_MAP: Record<AssociationBadgeType, string> = {
  [AssociationBadgeType.SKILL]: ICONS.SKILLS,
  [AssociationBadgeType.EXPERIENCE]: ICONS.EXPERIENCES,
  [AssociationBadgeType.ACTIVITY]: ICONS.ACTIVITY,
  [AssociationBadgeType.TRACE]: ICONS.TRACES,
}

const label = computed(() => t(`global.badges.AssociationBadge.${type}`, count))
const icon = computed(() => ICON_MAP[type])
</script>

<template>
  <AvBadge
    data-testid="association-badge"
    :data-type="type"
    :label="label"
    :icon="icon"
    background-color="var(--light-background-neutral)"
    color="var(--text1)"
    border-color="var(--stroke)"
    ellipsis
    small
  />
</template>

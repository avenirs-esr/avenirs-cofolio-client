<script setup lang="ts">
import { EAssociationContextType } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants/icons'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociatedElementTypeBadgeProps {
  associatedElementType: EAssociationContextType
}

const { associatedElementType } = defineProps<AssociatedElementTypeBadgeProps>()

const { t } = useI18n()

const ICON_MAP: Record<EAssociationContextType, string> = {
  [EAssociationContextType.TRACE]: ICONS.TRACES,
  [EAssociationContextType.DECLARED_SKILL]: ICONS.SKILLS,
  [EAssociationContextType.DECLARED_EXPERIENCE]: ICONS.EXPERIENCES,
  [EAssociationContextType.DECLARED_ACTIVITY]: ICONS.ACTIVITY,
}

const icon = computed(() => ICON_MAP[associatedElementType])
const label = computed(() => t(`global.activities.badges.associatedElementType.${associatedElementType}`))
</script>

<template>
  <AvBadge
    data-testid="associated-element-type-badge"
    :data-type="associatedElementType"
    :label="label"
    :icon="icon"
    background-color="var(--light-background-neutral)"
    color="var(--text1)"
    border-color="var(--stroke)"
  />
</template>

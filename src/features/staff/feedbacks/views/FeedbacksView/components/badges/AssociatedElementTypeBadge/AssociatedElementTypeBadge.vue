<script setup lang="ts">
import type { EAssociationContextType } from '@/api/avenir-esr'
import { ASSOCIATION_TYPE_ICONS } from '@/common/associations/constants/association-type.constants'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociatedElementTypeBadgeProps {
  associatedElementType: EAssociationContextType
}

const { associatedElementType } = defineProps<AssociatedElementTypeBadgeProps>()

const { t } = useI18n()

const icon = computed(() => ASSOCIATION_TYPE_ICONS[associatedElementType])
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

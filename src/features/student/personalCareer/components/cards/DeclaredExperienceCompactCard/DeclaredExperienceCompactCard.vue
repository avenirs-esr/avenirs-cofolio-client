<script lang="ts" setup>
import type { IdTitle } from '@/types'
import ValorizedBadge from '@/common/components/ValorizedBadge/ValorizedBadge.vue'
import CompactCard from '@/features/student/global/components/cards/CompactCard/CompactCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface DeclaredExperienceCompactCardProps {
  experience: IdTitle
  valorized: boolean
}
const { experience, valorized } = defineProps<DeclaredExperienceCompactCardProps>()
</script>

<template>
  <CompactCard
    :element="experience"
    :icon="MDI_ICONS.HUB_OUTLINE"
    color="var(--text1)"
    icon-color="var(--icon)"
    background-color="var(--surface-background)"
    border-color="var(--other-border-skill-card)"
    icon-border-color="var(--other-border-skill-card)"
  >
    <ValorizedBadge v-if="valorized" />
  </CompactCard>
</template>

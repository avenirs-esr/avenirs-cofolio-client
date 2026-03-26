<script lang="ts" setup>
import type { IdTitle } from '@/types'
import ValorizedBadge from '@/common/components/ValorizedBadge/ValorizedBadge.vue'
import CompactCard from '@/features/student/global/components/cards/CompactCard/CompactCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface DeclaredProgramCompactCardProps {
  program: IdTitle
  valorized: boolean
}
const { program, valorized } = defineProps<DeclaredProgramCompactCardProps>()
</script>

<template>
  <CompactCard
    :element="program"
    :icon="MDI_ICONS.SCHOOL_OUTLINE"
    color="var(--text1)"
    icon-color="var(--icon)"
    background-color="var(--surface-background)"
    border-color="var(--other-border-skill-card)"
    icon-border-color="var(--other-border-skill-card)"
  >
    <ValorizedBadge v-if="valorized" />
  </CompactCard>
</template>

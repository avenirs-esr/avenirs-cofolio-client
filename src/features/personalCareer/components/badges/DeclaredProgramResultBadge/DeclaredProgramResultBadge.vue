<script setup lang="ts">
import { AvBadge, RI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface DeclaredProgramResultBadgeProps {
  result: string
}

const { result } = defineProps<DeclaredProgramResultBadgeProps>()
</script>

<template>
  <AvBadge
    :label="result"
    :icon="RI_ICONS.LAYOUT_6_LINE"
    color="var(--card2)"
    background-color="var(--dark-background-primary1)"
    ellipsis
    data-testid="declared-program-result-badge"
  />
</template>

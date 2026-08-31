<script setup lang="ts">
import { AvBadge, ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'

export interface DeclaredSkillMacroSkillBadgeProps {
  pathSegments: string[]
}

const { pathSegments } = defineProps<DeclaredSkillMacroSkillBadgeProps>()
</script>

<template>
  <AvBadge
    :label="pathSegments.join(' > ')"
    color="var(--dark-background-accent)"
    background-color="var(--light-background-accent)"
    :icon="ICONS_DATA_URL.MDI_STARS"
    small
    ellipsis
  />
</template>

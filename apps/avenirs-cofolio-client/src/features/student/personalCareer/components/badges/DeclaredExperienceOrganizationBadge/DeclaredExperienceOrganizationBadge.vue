<script setup lang="ts">
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface DeclaredExperienceOrganizationBadgeProps {
  organization: string
}

const { organization } = defineProps<DeclaredExperienceOrganizationBadgeProps>()
</script>

<template>
  <AvBadge
    :label="organization"
    :icon="MDI_ICONS.MAP_MARKER_OUTLINE"
    color="var(--text2)"
    background-color="transparent"
    ellipsis
  />
</template>

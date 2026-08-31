<script setup lang="ts">
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface DeclaredProgramOrganizationBadgeProps {
  organization: string
  period?: string
}

const { organization, period } = defineProps<DeclaredProgramOrganizationBadgeProps>()

const label = computed(() => period ? `${organization} • ${period}` : organization)
</script>

<template>
  <AvBadge
    :label="label"
    :icon="MDI_ICONS.BUILDING"
    color="var(--text1)"
    background-color="transparent"
    ellipsis
    data-testid="declared-program-organization-badge"
  />
</template>

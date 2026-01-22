<script setup lang="ts">
import { AvBadge, ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'

export interface StudentTraceAssociationContentBadgeProps {
  label: string
  icon?: string
}

const {
  label,
  icon = ICONS_DATA_URL.AMS_SAE
} = defineProps<StudentTraceAssociationContentBadgeProps>()
</script>

<template>
  <AvBadge
    :label="label"
    color="var(--light-foreground-text1)"
    background-color="var(--surface-background)"
    :icon="icon"
    small
    ellipsis
    class="student-trace-association-content-badge caption-regular av-radius-sm av-flex-fill av-border-width-sm av-border-style-solid"
  />
</template>

<style lang="scss" scoped>
.student-trace-association-content-badge {
  border-color: var(--stroke);
}
</style>

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
    class="student-trace-association-content-badge caption-regular"
  />
</template>

<style lang="scss" scoped>
.student-trace-association-content-badge {
  border: 0.06rem solid var(--stroke);
  border-radius: var(--radius-sm);
  flex: 1;
}
</style>

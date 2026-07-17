<script lang="ts" setup>
import type { EFileType } from '@/api/avenir-esr'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface TraceFileTypeBadgeProps {
  fileType: EFileType
}

const { fileType } = defineProps<TraceFileTypeBadgeProps>()
</script>

<template>
  <AvBadge
    :label="fileType"
    color="var(--text1)"
    background-color="var(--surface-background)"
    border-color="var(--other-border-skill-card)"
    :icon="MDI_ICONS.FILE_DOCUMENT_MULTIPLE_OUTLINE"
    small
    ellipsis
    data-testid="trace-file-type-badge"
  />
</template>

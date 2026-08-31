<script lang="ts" setup>
import { EFileType } from '@/api/avenir-esr'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface TraceFileTypeBadgeProps {
  fileType: EFileType
}

const { fileType } = defineProps<TraceFileTypeBadgeProps>()

const IMAGE_FILE_TYPES = new Set<EFileType>([
  EFileType.PNG,
  EFileType.JPEG,
  EFileType.PJPEG,
  EFileType.GIF,
  EFileType.WEBP
])

const icon = computed(() => IMAGE_FILE_TYPES.has(fileType) ? MDI_ICONS.FILE_IMAGE_OUTLINE : MDI_ICONS.FILE_DOCUMENT_MULTIPLE_OUTLINE)
</script>

<template>
  <AvBadge
    :label="fileType"
    color="var(--text1)"
    background-color="var(--surface-background)"
    border-color="var(--other-border-skill-card)"
    :icon="icon"
    small
    ellipsis
    data-testid="trace-file-type-badge"
  />
</template>

<script lang="ts" setup>
import { EFileType } from '@/api/avenir-esr'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface TraceAttachmentTypeBadgeProps {
  fileType?: EFileType
}

const { fileType } = defineProps<TraceAttachmentTypeBadgeProps>()

const { t } = useI18n()

const IMAGE_FILE_TYPES = new Set<EFileType>([
  EFileType.PNG,
  EFileType.JPEG,
  EFileType.PJPEG,
  EFileType.GIF,
  EFileType.WEBP
])

const icon = computed(() => {
  if (!fileType) {
    return MDI_ICONS.LINK
  }

  return IMAGE_FILE_TYPES.has(fileType) ? MDI_ICONS.FILE_IMAGE_OUTLINE : MDI_ICONS.FILE_DOCUMENT_MULTIPLE_OUTLINE
})

const label = computed(() => fileType ?? t('global.link'))
</script>

<template>
  <AvBadge
    :label="label"
    color="var(--text1)"
    background-color="var(--surface-background)"
    border-color="var(--other-border-skill-card)"
    :icon="icon"
    small
    ellipsis
    data-testid="trace-attachment-type-badge"
  />
</template>

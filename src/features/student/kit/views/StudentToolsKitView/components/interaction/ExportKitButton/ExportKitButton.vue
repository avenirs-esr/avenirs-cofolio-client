<script lang="ts" setup>
import { useExportKit } from '@/features/student/kit/composables/use-export-kit/use-export-kit'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

const { generateKitDocx, isLoading } = useExportKit()

// TODO: i18n
</script>

<template>
  <div class="av-row av-w-full av-justify-end">
    <AvButton
      label="Exporter mon kit"
      :icon="MDI_ICONS.DOWNLOAD_OUTLINE"
      variant="FLAT"
      small
      :is-loading="isLoading"
      @click="() => generateKitDocx('mon-document.docx')"
    />
  </div>
</template>

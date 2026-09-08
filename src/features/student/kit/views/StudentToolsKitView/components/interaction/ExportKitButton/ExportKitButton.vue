<script lang="ts" setup>
import { useExportKit } from '@/features/student/kit/composables/use-export-kit/use-export-kit'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { generateKitDocx, isLoading } = useExportKit()

const { t } = useI18n()
</script>

<template>
  <div class="av-row av-w-full av-justify-end">
    <AvButton
      :label="t('student.kit.views.StudentToolsKitView.interaction.ExportKitButton.label')"
      :icon="MDI_ICONS.DOWNLOAD_OUTLINE"
      variant="FLAT"
      small
      :is-loading="isLoading"
      @click="() => generateKitDocx('mon-document.docx')"
    />
  </div>
</template>

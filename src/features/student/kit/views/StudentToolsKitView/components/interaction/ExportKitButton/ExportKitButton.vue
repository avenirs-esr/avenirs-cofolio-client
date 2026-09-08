<script lang="ts" setup>
import { useModal } from '@/common/composables'
import ExportKitModal from '@/features/student/kit/views/StudentToolsKitView/components/overlay/ExportKitModal/ExportKitModal.vue'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()
</script>

<template>
  <div class="av-row av-w-full av-justify-end">
    <AvButton
      :label="t('student.kit.views.StudentToolsKitView.interaction.ExportKitButton.label')"
      :icon="MDI_ICONS.DOWNLOAD_OUTLINE"
      variant="FLAT"
      small
      @click="displayModal"
    />
  </div>

  <ExportKitModal
    :opened="showModal"
    @close="hideModal"
  />
</template>

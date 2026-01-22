<script setup lang="ts">
import { useModal } from '@/common/composables'
import MindMap from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/MindMap.vue'
import StudentProjectTrajectoriesHelperModal
  from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesHelperModal/StudentProjectTrajectoriesHelperModal.vue'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { showModal, displayModal, hideModal } = useModal()
</script>

<template>
  <div class="av-row av-wrap av-gap-sm av-justify-between av-align-center av-mb-sm">
    <div class=" b1-bold">
      {{ t('student.global.views.studentProjectTrajectoriesView.buildProject.title') }}
    </div>
    <AvButton
      variant="OUTLINED"
      :label="t('student.global.views.studentProjectTrajectoriesView.buildProject.consultHelpButtonLabel')"
      :icon="MDI_ICONS.FLAG_VARIANT"
      small
      @click="displayModal"
    />
  </div>

  <MindMap />

  <StudentProjectTrajectoriesHelperModal
    :show-modal="showModal"
    :on-close="hideModal"
  />
</template>

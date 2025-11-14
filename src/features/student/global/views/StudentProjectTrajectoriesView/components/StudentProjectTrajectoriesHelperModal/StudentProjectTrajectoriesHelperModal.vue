<script setup lang="ts">
import { useBackOfficeBuildLifeProjectConfigQuery } from '@/features/student/global/queries/use-back-office.query/use-back-office.query'
import { AvModal, formatTextToHtml } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const {
  showModal,
  onClose
} = defineProps<{ showModal: boolean, onClose: () => void }>()

const { t } = useI18n()

const { data: config } = useBackOfficeBuildLifeProjectConfigQuery()
</script>

<template>
  <AvModal
    :opened="showModal"
    :close-button-label="t('student.views.studentProjectTrajectoriesView.buildProject.projectTrajectoriesHelperModal.closeButtonLabel')"
    @close="onClose"
  >
    <div
      v-if="config"
      class="student-project-trajectories-helper-modal__container"
      v-html="formatTextToHtml(config.html)"
    />
  </AvModal>
</template>

<style lang="scss" scoped>
.student-project-trajectories-helper-modal__container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}
</style>

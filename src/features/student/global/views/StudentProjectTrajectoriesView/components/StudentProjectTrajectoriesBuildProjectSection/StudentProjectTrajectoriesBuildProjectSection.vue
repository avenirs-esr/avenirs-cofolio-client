<script setup lang="ts">
import { useModal } from '@/common/composables'
import StudentProjectTrajectoriesHelperModal
  from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesHelperModal/StudentProjectTrajectoriesHelperModal.vue'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { showModal, displayModal, hideModal } = useModal()
</script>

<template>
  <div class="student-project-trajectories-build-project-header">
    <div class="student-project-trajectories-build-project-header__title b1-bold">
      {{ t('student.views.studentProjectTrajectoriesView.buildProject.title') }}
    </div>
    <AvButton
      variant="OUTLINED"
      :label="t('student.views.studentProjectTrajectoriesView.buildProject.consultHelpButtonLabel')"
      :icon="MDI_ICONS.FLAG_VARIANT"
      small
      @click="displayModal"
    />
  </div>

  <StudentProjectTrajectoriesHelperModal
    :show-modal="showModal"
    :on-close="hideModal"
  />
</template>

<style lang="scss" scoped>
.student-project-trajectories-build-project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.student-project-trajectories-build-project-header__title {
  flex: 1;
}
</style>

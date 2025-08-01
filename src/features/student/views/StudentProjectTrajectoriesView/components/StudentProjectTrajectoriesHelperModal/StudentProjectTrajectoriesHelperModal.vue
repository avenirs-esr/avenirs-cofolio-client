<script setup lang="ts">
import { AvModal } from '@/ui'
import { formatTextToHtml } from '@/ui/utils'
import { useI18n } from 'vue-i18n'

const {
  showModal,
  onClose
} = defineProps<{ showModal: boolean, onClose: () => void }>()

const { t } = useI18n()
</script>

<template>
  <AvModal
    :opened="showModal"
    :close-button-label="t('student.views.studentProjectTrajectoriesView.buildProject.projectTrajectoriesHelperModal.closeButtonLabel')"
    size="lg"
    @close="onClose"
  >
    <div class="student-project-trajectories-helper-modal__container">
      <div
        class="student-project-trajectories-helper-modal__header"
        v-html="formatTextToHtml(t('student.views.studentProjectTrajectoriesView.buildProject.projectTrajectoriesHelperModal.title'))"
      />
      <div class="student-project-trajectories-helper-modal__content">
        <span v-html="formatTextToHtml(t('student.views.studentProjectTrajectoriesView.buildProject.projectTrajectoriesHelperModal.content'))" />
      </div>
    </div>
  </AvModal>
</template>

<style lang="scss" scoped>
.student-project-trajectories-helper-modal__container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.student-project-trajectories-helper-modal__content {
  flex: 1;
  overflow-y: auto;
}

.student-project-trajectories-helper-modal__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-n6);
  line-height: var(--line-height-n5);
}
</style>

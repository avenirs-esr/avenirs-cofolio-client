<script setup lang="ts">
import { useModal, useNavigation } from '@/common/composables'
import { AvButton, AvIconText, AvModal, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()
const { navigateToStudentHome, navigateToTeacherHome } = useNavigation()
const route = useRoute()
const isStudentRoute = route.path.startsWith('/student')

function onStudentButtonClick () {
  hideModal()
  !isStudentRoute && navigateToStudentHome()
}

function onTeacherButtonClick () {
  hideModal()
  isStudentRoute && navigateToTeacherHome()
}
</script>

<template>
  <AvButton
    class="demo-display-none"
    :label="t('global.header.switchUniverse.label')"
    :icon="MDI_ICONS.SWAP_HORIZONTAL"
    @click="displayModal"
  />
  <AvModal
    :opened="showModal"
    :close-button-label="t('global.buttons.exit')"
    @close="hideModal"
  >
    <template #header>
      <AvIconText
        :icon="MDI_ICONS.SWAP_HORIZONTAL"
        icon-color="var(--dark-background-primary1)"
        :text="t('global.header.switchUniverse.label')"
        text-color="var(--title)"
        typography-class="n6"
        gap="var(--spacing-sm)"
      />
    </template>
    <div class="modal-content">
      <AvButton
        :label="t('global.header.switchUniverse.teacher')"
        theme="SECONDARY"
        size="sm"
        :on-click="onTeacherButtonClick"
      />
      <AvButton
        :label="t('global.header.switchUniverse.student')"
        theme="SECONDARY"
        size="sm"
        :on-click="onStudentButtonClick"
      />
    </div>
  </AvModal>
</template>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}
</style>

<script setup lang="ts">
import { useModal, useNavigation } from '@/common/composables'
import { AvButton, AvIconText, AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()
const { navigateToStudentHome, navigateToStaffHome } = useNavigation()
const route = useRoute()
const isStudentRoute = route.path.startsWith('/student')

function onStudentButtonClick () {
  hideModal()
  !isStudentRoute && navigateToStudentHome()
}

function onStaffButtonClick () {
  hideModal()
  isStudentRoute && navigateToStaffHome()
}
</script>

<template>
  <AvButton
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
    <div class="av-col av-gap-lg">
      <AvButton
        :label="t('global.header.switchUniverse.staff')"
        theme="SECONDARY"
        small
        @click="onStaffButtonClick"
      />
      <AvButton
        :label="t('global.header.switchUniverse.student')"
        theme="SECONDARY"
        small
        @click="onStudentButtonClick"
      />
    </div>
  </AvModal>
</template>

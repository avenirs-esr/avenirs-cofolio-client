<script setup lang="ts">
import { AvButton, AvModal, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const {
  showModal,
  onClose,
} = defineProps<{ showModal: boolean, onClose: () => void }>()

const { t } = useI18n()
</script>

<template>
  <AvModal
    title=""
    :opened="showModal"
    @close="onClose"
  >
    <ul>
      <li>
        <AvButton
          :label="t('student.modals.profileModal.buttons.manageProfile')"
          :icon="MDI_ICONS.PENCIL"
          variant="DEFAULT"
          theme="SECONDARY"
        />
      </li>
      <li>
        <AvButton
          :label="t('student.modals.profileModal.buttons.seeCalendar')"
          :icon="MDI_ICONS.CALENDAR_MONTH"
          variant="DEFAULT"
          theme="SECONDARY"
        />
      </li>
      <li>
        <AvButton
          :label="t('student.modals.profileModal.buttons.goToDw')"
          :icon="MDI_ICONS.ARROW_TOP_RIGHT"
          variant="DEFAULT"
          theme="SECONDARY"
        />
      </li>
      <li>
        <AvButton
          :label="t('student.modals.profileModal.buttons.goToSkills')"
          :icon="MDI_ICONS.ARROW_TOP_RIGHT"
          variant="DEFAULT"
          theme="SECONDARY"
        />
      </li>
      <li>
        <AvButton
          :label="t('student.modals.profileModal.buttons.logout')"
          :icon="MDI_ICONS.LOGOUT"
          variant="DEFAULT"
          theme="SECONDARY"
        />
      </li>
    </ul>
  </AvModal>
</template>

<style lang="scss" scoped>
ul {
  list-style-type:none;
  padding: 0;
  margin: 0;
}
</style>

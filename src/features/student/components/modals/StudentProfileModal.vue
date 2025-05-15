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
          :label="t('feature.student.modals.profileModal.buttons.manageProfile')"
          :icon="MDI_ICONS.PENCIL"
          variant="tertiary-no-outline"
          color="--foregroud-text1"
        />
      </li>
      <li>
        <AvButton
          :label="t('feature.student.modals.profileModal.buttons.seeCalendar')"
          :icon="MDI_ICONS.CALENDAR_MONTH"
          variant="tertiary-no-outline"
          color="--foregroud-text1"
        />
      </li>
      <li>
        <AvButton
          :label="t('feature.student.modals.profileModal.buttons.goToDw')"
          :icon="MDI_ICONS.ARROW_TOP_RIGHT"
          variant="tertiary-no-outline"
          color="--foregroud-text1"
        />
      </li>
      <li>
        <AvButton
          :label="t('feature.student.modals.profileModal.buttons.goToSkills')"
          :icon="MDI_ICONS.ARROW_TOP_RIGHT"
          variant="tertiary-no-outline"
          color="--foregroud-text1"
        />
      </li>
      <li>
        <AvButton
          :label="t('feature.student.modals.profileModal.buttons.logout')"
          :icon="MDI_ICONS.LOGOUT"
          variant="tertiary-no-outline"
          color="--foregroud-text1"
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

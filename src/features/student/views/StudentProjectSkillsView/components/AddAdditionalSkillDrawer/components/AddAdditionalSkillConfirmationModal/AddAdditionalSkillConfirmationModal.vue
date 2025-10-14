<script lang="ts" setup>
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const { t } = useI18n()

function handleCancel () {
  emit('cancel')
}

function handleConfirm () {
  emit('confirm')
}
</script>

<template>
  <AvModal
    :opened="show"
    modal-id="add-additional-skill-confirmation-modal"
    :close-button-label="t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.confirmationModal.cancelButton')"
    :confirm-button-label="t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.confirmationModal.confirmButton')"
    @close="handleCancel"
    @confirm="handleConfirm"
  >
    <div class="content-container">
      <span class="b2-regular">
        {{ t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.confirmationModal.description') }}
      </span>
    </div>
  </AvModal>
</template>

<style lang="scss" scoped>
.content-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  text-align: center;
}
</style>

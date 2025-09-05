<script lang="ts" setup>
import { AvButton, AvModal, MDI_ICONS } from '@/ui'
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
    @close="handleCancel"
  >
    <div class="content-container">
      <span class="b2-regular">
        {{ t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.confirmationModal.description') }}
      </span>
    </div>
    <template #footer>
      <AvButton
        variant="OUTLINED"
        theme="PRIMARY"
        :label="t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.confirmationModal.confirmButton')"
        :icon="MDI_ICONS.CHECK"
        size="sm"
        @click="handleConfirm"
      />
    </template>
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

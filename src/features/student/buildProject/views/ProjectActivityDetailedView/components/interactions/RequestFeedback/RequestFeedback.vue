<script setup lang="ts">
import { ConfirmationModal } from '@/common/components'
import { useModal } from '@/common/composables'
import { AvButton, MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface RequestFeedbackProps {
  disabled?: boolean
  isLoading?: boolean
  remainingFeedbacks: number
}

const { disabled, isLoading, remainingFeedbacks } = defineProps<RequestFeedbackProps>()
const emit = defineEmits<{ (e: 'requestFeedback'): void }>()

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()

function handleConfirm () {
  hideModal()
  emit('requestFeedback')
}
</script>

<template>
  <div
    class="av-col av-align-end av-items-end av-pt-md"
    data-testid="request-feedback"
  >
    <AvButton
      data-testid="request-feedback-button"
      :label="t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.requestFeedbackButton')"
      variant="OUTLINED"
      :icon="MS_ICONS.SEND_OUTLINE_ROUNDED"
      :disabled="disabled"
      :is-loading="isLoading"
      @click="displayModal"
    />
  </div>
  <ConfirmationModal
    :show="showModal"
    data-testid="request-feedback-confirm-modal"
    :title="t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.requestFeedbackConfirmModal.title')"
    :description="t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.requestFeedbackConfirmModal.description', { count: remainingFeedbacks })"
    :is-loading="isLoading"
    @close="hideModal"
    @confirm="handleConfirm"
  />
</template>

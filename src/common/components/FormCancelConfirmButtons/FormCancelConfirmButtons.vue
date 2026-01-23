<script setup lang="ts">
import { AvCancelConfirmButtons, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FormCancelConfirmButtonsProps {
  isSubmitting: boolean
  isFormValid: boolean
  cancelLabel?: string
  confirmLabel?: string
}

const {
  isSubmitting,
  isFormValid,
} = defineProps<FormCancelConfirmButtonsProps>()

const emit = defineEmits<{
  (e: 'handleCancel'): void
  (e: 'handleSubmit'): void
}>()

const { t } = useI18n()
</script>

<template>
  <AvCancelConfirmButtons
    :cancel-label="cancelLabel ?? t('global.buttons.cancel')"
    :confirm-label="confirmLabel ?? t('global.buttons.save')"
    :cancel-icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
    :confirm-icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
    :cancel-disabled="isSubmitting"
    :confirm-disabled="!isFormValid || isSubmitting"
    :confirm-is-loading="isSubmitting"
    @cancel="emit('handleCancel')"
    @confirm="emit('handleSubmit')"
  />
</template>

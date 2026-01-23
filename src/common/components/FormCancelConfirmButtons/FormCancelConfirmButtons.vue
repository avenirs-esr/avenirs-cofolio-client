<script setup lang="ts">
import { AvCancelConfirmButtons, type AvCancelConfirmButtonsProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FormCancelConfirmButtonsProps extends AvCancelConfirmButtonsProps {
  isSubmitting: boolean
  isFormValid: boolean
}

const props = defineProps<FormCancelConfirmButtonsProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()

const { t } = useI18n()

const avCancelConfirmButtonsProps = computed(() => ({
  ...props,
  cancelLabel: props.cancelLabel ?? t('global.buttons.cancel'),
  confirmLabel: props.confirmLabel ?? t('global.buttons.save'),
  cancelIcon: props.cancelIcon ?? MDI_ICONS.CLOSE_CIRCLE_OUTLINE,
  confirmIcon: props.confirmIcon ?? MDI_ICONS.CONTENT_SAVE_OUTLINE,
  cancelDisabled: props.isSubmitting,
  confirmDisabled: !props.isFormValid,
  confirmIsLoading: props.isSubmitting
}))
</script>

<template>
  <AvCancelConfirmButtons
    v-bind="avCancelConfirmButtonsProps"
    @cancel="emit('cancel')"
    @confirm="emit('submit')"
  />
</template>

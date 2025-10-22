<script lang="ts" setup>
import { AvModal, type AvModalProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ConfirmationModalProps extends Omit<AvModalProps, 'closeButtonLabel'> {
  show: boolean
  title?: string
  description?: string
  closeButtonLabel?: string
}

defineProps<ConfirmationModalProps>()
const { t } = useI18n()
</script>

<template>
  <AvModal
    :opened="show"
    modal-id="confirmation-modal"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('global.buttons.confirm')"
    v-bind="$attrs"
  >
    <template
      v-if="$slots.header"
      #header
    >
      <slot name="header" />
    </template>

    <slot>
      <div class="content-container">
        <span class="n5">{{ title ?? t('global.modals.confirmation.title') }}</span>
        <span class="b2-light">{{ description ?? t('global.modals.confirmation.description') }}</span>
      </div>
    </slot>
  </AvModal>
</template>

<style lang="scss" scoped>
.content-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>

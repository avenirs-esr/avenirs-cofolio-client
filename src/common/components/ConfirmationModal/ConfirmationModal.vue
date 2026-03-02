<script lang="ts" setup>
import { AvModal, type AvModalProps } from '@avenirs-esr/avenirs-dsav'
import { type Slot, useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ConfirmationModalProps extends Omit<AvModalProps, 'closeButtonLabel'> {
  show: boolean
  title?: string
  description?: string
  closeButtonLabel?: string
}

defineOptions({
  inheritAttrs: false
})

defineProps<ConfirmationModalProps>()

defineSlots<{
  header?: Slot
  default?: Slot
}>()

const { t } = useI18n()
const attrs = useAttrs()
</script>

<template>
  <AvModal
    id="confirmation-modal"
    :opened="show"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="confirmButtonLabel ?? t('global.buttons.confirm')"
    v-bind="attrs"
  >
    <template
      v-if="$slots.header"
      #header
    >
      <slot name="header" />
    </template>
    <slot>
      <div
        class="av-col av-gap-sm"
        data-testid="content-container"
      >
        <span class="n5">{{ title ?? t('global.modals.confirmation.title') }}</span>
        <span class="b2-light">{{ description ?? t('global.modals.confirmation.description') }}</span>
      </div>
    </slot>
  </AvModal>
</template>

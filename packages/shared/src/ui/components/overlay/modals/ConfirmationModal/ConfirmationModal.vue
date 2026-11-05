<script lang="ts" setup>
import type { AvModalProps } from '@avenirs-esr/avenirs-dsav'
import type { Slot } from 'vue'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { computed, useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ConfirmationModalProps extends Omit<AvModalProps, 'closeButtonLabel'> {
  opened: boolean
  title?: string
  description?: string
  closeButtonLabel?: string
  showDescription?: boolean
}

defineOptions({
  inheritAttrs: false
})

const { showDescription = true, ...props } = defineProps<ConfirmationModalProps>()

defineSlots<{
  header?: Slot
  default?: Slot
}>()

const attrs = useAttrs()

const avModalProps = computed(() => {
  const {
    title,
    description,
    closeButtonLabel,
    confirmButtonLabel,
    id,
    ...rest
  } = props
  return rest
})

const avModalBindings = computed(() => ({
  ...attrs,
  ...avModalProps.value
}))

const { t } = useI18n()
</script>

<template>
  <AvModal
    id="confirmation-modal"
    :close-button-label="props.closeButtonLabel ?? t('global.overlay.modals.ConfirmationModal.cancel')"
    :confirm-button-label="props.confirmButtonLabel ?? t('global.overlay.modals.ConfirmationModal.confirm')"
    v-bind="avModalBindings"
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
        <span
          class="n5"
          data-testid="modal-title"
        >{{ props.title ?? t('global.overlay.modals.ConfirmationModal.title') }}</span>
        <span
          v-if="showDescription"
          class="b2-light"
          data-testid="modal-description"
        >{{ props.description ?? t('global.overlay.modals.ConfirmationModal.description') }}</span>
      </div>
    </slot>
  </AvModal>
</template>

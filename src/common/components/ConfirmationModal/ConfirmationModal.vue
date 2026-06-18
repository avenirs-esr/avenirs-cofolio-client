<script lang="ts" setup>
import type { Slot } from 'vue'
import { AvModal, type AvModalProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ConfirmationModalProps extends Omit<AvModalProps, 'closeButtonLabel'> {
  show: boolean
  title?: string
  description?: string
  closeButtonLabel?: string
  noDescription?: boolean
}

defineOptions({
  inheritAttrs: false
})

const { noDescription = false, ...props } = defineProps<ConfirmationModalProps>()

defineSlots<{
  header?: Slot
  default?: Slot
}>()

const attrs = useAttrs()

const avModalProps = computed(() => {
  const {
    show,
    title,
    description,
    closeButtonLabel,
    confirmButtonLabel,
    opened,
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
    :opened="props.show"
    :close-button-label="props.closeButtonLabel ?? t('global.buttons.cancel')"
    :confirm-button-label="props.confirmButtonLabel ?? t('global.buttons.confirm')"
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
        <span class="n5">{{ props.title ?? t('global.modals.confirmation.title') }}</span>
        <span
          v-if="!noDescription"
          class="b2-light"
        >{{ props.description ?? t('global.modals.confirmation.description') }}</span>
      </div>
    </slot>
  </AvModal>
</template>

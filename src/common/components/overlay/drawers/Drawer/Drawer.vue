<script setup lang="ts">
import type { Slot } from 'vue'
import { AvCancelConfirmButtons, type AvCancelConfirmButtonsProps, AvDrawer, type AvDrawerProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DrawerProps extends AvDrawerProps {
  confirmLabel?: string
  confirmCancelProps?: Partial<AvCancelConfirmButtonsProps>
  closeOnClickOutside?: boolean
}

const {
  position = 'right',
  width = '40rem',
  confirmLabel,
  confirmCancelProps = {},
  closeOnClickOutside = false,
  ...restProps
} = defineProps<DrawerProps>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'confirm'): void
}>()

defineSlots<{
  default?: Slot
  footer?: Slot
}>()

const { t } = useI18n()

const confirmCancelPropsWithDefaults = computed<Partial<AvCancelConfirmButtonsProps>>(() => ({
  cancelLabel: t('global.buttons.cancel'),
  cancelIcon: MDI_ICONS.CLOSE_CIRCLE_OUTLINE,
  confirmIcon: MDI_ICONS.CONTENT_SAVE_OUTLINE,
  ...(confirmLabel && { confirmLabel }),
  ...confirmCancelProps
}))

function handleClose () {
  emit('close')
}

function handleClickOutside () {
  if (closeOnClickOutside) {
    handleClose()
  }
}

function handleConfirm () {
  emit('confirm')
}
</script>

<template>
  <AvDrawer
    :position="position"
    :width="width"
    v-bind="restProps"
    @escape-pressed="handleClose"
    @click-outside="handleClickOutside"
  >
    <template #default>
      <slot />
    </template>
    <template #footer>
      <slot name="footer">
        <div class="av-row av-justify-end">
          <AvCancelConfirmButtons
            v-bind="confirmCancelPropsWithDefaults"
            @cancel="handleClose"
            @confirm="handleConfirm"
          />
        </div>
      </slot>
    </template>
  </AvDrawer>
</template>

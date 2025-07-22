<script setup lang="ts">
import type { Slot } from 'vue'
import { AvButton, type AvButtonProps } from '@/ui/interaction'
import { MDI_ICONS } from '@/ui/tokens/icons'
import { useI18n } from 'vue-i18n'

/**
 * AvModal component props.
 */
export interface AvModalProps {
  /**
   * Variant of the close button: without border (`DEFAULT`) or with border (`OUTLINED`).
   * @default 'DEFAULT'
   */
  closeButtonVariant?: AvButtonProps['variant']

  /**
   * Unique identifier for the modal.
   * @default useRandomId('modal', 'dialog')
   */
  modalId?: string

  /**
   * Indicates whether the modal is open.
   * @default false
   */
  opened?: boolean

  /**
   * Specifies whether the modal is an alert (role `"alertdialog"` if `true`) or not (role will be `"dialog"`).
   * @default false
   */
  isAlert?: boolean

  /**
   * Reference to original element to restore focus after closing.
   * @default { focus() {} }
   */
  origin?: {
    focus: () => void
  }

  /**
   * Name of icon to be displayed in modal title.
   */
  icon?: string

  /**
   * Modal size.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'

  /**
   * Label and title (for accessibility) of the close button.
   * @default 'Fermer'
   */
  closeButtonLabel?: string

  /**
   * Adds a loading state on the close button.
   */
  isLoading?: boolean
}

const { isLoading, ...props } = defineProps<AvModalProps>()

/**
 * Events emitted by the component.
 *
 * @event close - Event emitted when the modal is closed.
 */
const emit = defineEmits<{
  (e: 'close'): void
}>()

/**
 * Slots available in the component.
 *
 * @slot default - Default slot for modal content.
 * @slot header - Slot for modal title.
 * @slot footer - Slot for modal footer.
 */
const slots = defineSlots<{
  default?: Slot
  header?: Slot
  footer?: Slot
}>()

const { t } = useI18n()

const closeButtonLabel = computed(() => props.closeButtonLabel ?? t('global.buttons.close'))
const closeButtonVariant = computed(() => props.closeButtonVariant ?? 'DEFAULT')
</script>

<template>
  <Teleport to="body">
    <DsfrModal
      v-bind="props"
      title=""
    >
      <template #default>
        <div
          v-if="slots.header"
          class="header"
        >
          <slot name="header" />
        </div>
        <slot />
      </template>
      <template #footer>
        <div class="footer">
          <AvButton
            :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
            :label="closeButtonLabel"
            :title="closeButtonLabel"
            :variant="closeButtonVariant"
            :is-loading="isLoading"
            size="sm"
            :on-click="() => emit('close')"
          />
          <slot name="footer" />
        </div>
      </template>
    </DsfrModal>
  </Teleport>
</template>

<style lang="scss" scoped>
:deep(.fr-modal__header),
:deep(.fr-modal__body),
:deep(.fr-modal__footer) {
  background: var(--dialog) !important;
}

:deep(.fr-modal__body) {
  border-radius: var(--radius-lg) !important;
}

:deep(.fr-btn--close) {
  display: none !important;
}

.header {
  padding-bottom: var(--spacing-md);
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: right;
  width: 100%;
  gap: var(--spacing-sm);
}
</style>

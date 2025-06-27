<script setup lang="ts">
import type { DsfrModalProps } from '@gouvminint/vue-dsfr'
import type { Slot } from 'vue'
import { AvButton, type AvButtonProps } from '@/ui/interaction'
import { MDI_ICONS } from '@/ui/tokens'
import { useI18n } from 'vue-i18n'

export type AvModalProps = {
  closeButtonVariant?: AvButtonProps['variant']
} & Omit<DsfrModalProps, 'title'>

const props = defineProps<AvModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

defineSlots<{
  default?: Slot
  header?: Slot
  footer?: Slot
}>()

const { t } = useI18n()

const closeButtonLabel = computed(() => props.closeButtonLabel ?? t('global.buttons.close'))
const closeButtonVariant = computed(() => props.closeButtonVariant ?? 'DEFAULT')
</script>

<template>
  <DsfrModal
    v-bind="props"
    title=""
  >
    <template #default>
      <div class="av-modal__header">
        <slot name="header" />
      </div>
      <slot />
    </template>
    <template #footer>
      <div class="footer">
        <AvButton
          :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
          :label="closeButtonLabel"
          :variant="closeButtonVariant"
          size="sm"
          @click="emit('close')"
        />
        <slot name="footer" />
      </div>
    </template>
  </DsfrModal>
</template>

<style lang="scss" scoped>
:deep(.fr-modal__header),
:deep(.fr-modal__body),
:deep(.fr-modal__footer) {
  background: var(--dialog) !important;
}

:deep(.fr-btn--close) {
  display: none !important;
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: right;
  width: 100%;
  gap: var(--spacing-sm);
}
</style>

<script setup lang="ts">
import type { DsfrModalProps } from '@gouvminint/vue-dsfr'
import type { Slot } from 'vue'

export type AvModalProps = DsfrModalProps

const props = defineProps<AvModalProps>()
defineSlots<{
  default?: Slot
  footer?: Slot
}>()
</script>

<template>
  <DsfrModal v-bind="props">
    <template #default>
      <slot />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </DsfrModal>
</template>

<style lang="scss" scoped>
:deep(.fr-modal__header),
:deep(.fr-modal__body),
:deep(.fr-modal__footer) {
  background: var(--dialog) !important;
}
</style>

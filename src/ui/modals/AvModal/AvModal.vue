<script setup lang="ts">
import type { DsfrModalProps } from '@gouvminint/vue-dsfr'
import type { Slot } from 'vue'

const props = defineProps<DsfrModalProps>()
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
:deep(.fr-btn:hover),
:deep(.fr-btn:hover *) {
  background-color: var(--dark-background-primary1);
  color: white;
}

:deep(.fr-modal__header),
:deep(.fr-modal__body),
:deep(.fr-modal__footer) {
  background: var(--background-dialog) !important;
}
</style>

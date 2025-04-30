<script setup lang="ts">
import type { FieldsetElementProps } from './types'
import { DSFR } from '@/utils'
import { computed, inject } from 'vue'

const props = withDefaults(defineProps<FieldsetElementProps>(), {
  size: undefined,
})

const { size } = props

const inline = inject<boolean | undefined>('fieldsetInline', false)

const inlineClass = computed(() => (inline ? `${DSFR.FIELDSET_ELEMENT_PREFIX}--inline` : undefined))
const sizeClass = computed(() => (size ? `${DSFR.FIELDSET_ELEMENT_PREFIX}--${size}` : undefined))
</script>

<template>
  <div
    class="fr-fieldset__element"
    :class="[inlineClass, sizeClass]"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped></style>

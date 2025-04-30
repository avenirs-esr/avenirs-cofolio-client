<script setup lang="ts">
import type { CheckboxProps } from './types'
import { computeSizeClass, DSFR } from '@/utils'
import { computed } from 'vue'
import { Message } from '../feedback'

const props = withDefaults(defineProps<CheckboxProps>(), {
  id: '',
  size: 'md',
  label: '',
  name: undefined,
  disabled: false,
  hint: undefined,
  status: undefined,
  validMessage: 'Opération réussie',
  errorMessage: 'Une erreur est survenue',
})

const { id, size, label, name, disabled, hint, status, validMessage, errorMessage } = props

const sizeClass = computed(() => computeSizeClass(size, DSFR.CHECKBOX_GROUP_PREFIX))
const checkboxGroupStatusClass = computed(() => {
  if (status) {
    return `${DSFR.CHECKBOX_GROUP_PREFIX}--${status}`
  }
  return undefined
})
</script>

<template>
  <div
    class="fr-checkbox-group"
    :class="[sizeClass, checkboxGroupStatusClass]"
  >
    <input
      :id="id"
      :name="name"
      type="checkbox"
      :disabled="disabled"
      :aria-describedby="`${id}-messages`"
    >
    <label
      class="fr-label"
      :for="id"
    >
      {{ label }} <span
        v-if="hint"
        class="fr-hint-text"
      >{{ hint }}</span>
    </label>
    <div
      :id="`${id}-messages`"
      class="fr-messages-group"
      aria-live="polite"
    >
      <Message
        :status="status"
        :error="errorMessage"
        :valid="validMessage"
        :id-parent="id"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

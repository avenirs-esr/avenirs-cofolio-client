<script setup lang="ts">
import type { FieldsetProps } from './types'
import { provide } from 'vue'
import { Message } from '../feedback'

const props = withDefaults(defineProps<FieldsetProps>(), {
  legend: '',
  hint: undefined,
  disabled: false,
  inline: false,
  status: undefined,
  validMessage: 'Opération réussie',
  errorMessage: 'Une erreur est survenue',
  id: '',
})

const { legend, hint, disabled, inline, status, validMessage, errorMessage, id } = props

provide('fieldsetInline', inline ?? false)
</script>

<template>
  <fieldset
    id="storybook-form"
    class="fr-fieldset"
    :disabled="disabled"
    :aria-labelledby="`${id}-legend ${id}-messages`"
  >
    <legend
      :id="`${id}-legend`"
      class="fr-fieldset__legend--regular fr-fieldset__legend"
    >
      {{ legend }} <span
        v-if="hint"
        class="fr-hint-text"
      >{{ hint }}</span>
    </legend>
    <slot />
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
  </fieldset>
</template>

<style lang="scss" scoped></style>
